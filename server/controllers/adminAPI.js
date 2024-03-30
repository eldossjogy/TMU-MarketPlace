import supabase from '../config/supabaseConfig.js'

function validateFormData(formData) {
    const errors = {};

    // Title validation
    if (!formData.title.trim()) {
        errors.title = 'Title is required.';
    } else if (formData.title.length > 100) {
        errors.title = 'Title must be at most 100 characters long.';
    }

    const price = parseInt(formData.price);
    if (isNaN(price)) {
        formData.price = 0
    }
    else if (price < 0 || price > 1000000) {
        errors.price = 'Price must be a number between $0 and $1,000,000.';
    }

    // Description validation
    if (!formData.description.trim()) {
        errors.description = 'Description is required.';
    }
    else if (formData.description.length > 350) {
        errors.description = 'Description must be at most 350 characters long.';
    }

    // Postal code validation
    if (formData.postal_code && !/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(formData.postal_code)) {
        errors.postal_code = 'Invalid Canadian postal code format.';
    }

    // Category ID validation
    if (formData.category_id === null) {
        errors.category_id = 'Category is required.';
    }

    if(!formData.location){
        errors.location = "Missing location."
    }
    else if (formData.location.length > 250) {
        errors.description = 'Location must be at most 250 characters long.';
    }

    if (isNaN(parseFloat(formData.lat)) || isNaN(parseFloat(formData.lng))){
        errors.coordinates = "Invalid coordinates";
    }

    return errors;
}

export async function verifyAdmin(req, res) {
    const {user_id} = req.body
    try {
        const checkAdmin = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user_id)
            .order('id', { ascending: false });
        
        res.status(200).json(checkAdmin.data[0])
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminGetAllListings(req, res) {

    try {
        const allListings = await supabase
            .from('ad')
            .select(
                `
                *,
                image (file_path),
                category (name),
                status (type),
                profile (name)
                `
            )
            .order('id', { ascending: false });
        
        if (allListings.status == 400) {
            const error = new Error(allListings.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(allListings.data)
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminGetQueryListing(req, res) {

    let queryValues = req.query

    try {

        const matchingQuery = {}

         //filter the records based on the query params
         if (queryValues) {
            // Loop through the queryParams object and add filters
            Object.entries(queryValues).forEach(([key, value]) => {
                if (value !== 'undefined') {
                    matchingQuery[key] = value
                }
            });
        }
        
        //selecting all records
        const queriedListing = await supabase
            .from('ad')
            .select(
                `
                *,
                image (file_path),
                category (name),
                status (type),
                profile (name)
                `
            )
            .match(matchingQuery)
            .order('id', { ascending: false });

        if (queriedListing.status == 400) {
            const error = new Error(queriedListing.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(queriedListing.data)
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }

}

export async function adminPostNewListing(req, res) {

    const {title, price, description, expire_time, postal_code, location, category_id, admin_id, images, lat, lng} = req.body
    try {
        
        //error checking
        let err = validateFormData({title, price, description, expire_time, postal_code, location, category_id, lat, lng})

        if (Object.keys(err).length !== 0) {
            const error = new Error("Bad form data !")
            error.message = err
            error.status = 422
            throw error;
        }
      
        //insert new data to ad db
        const newListing = await supabase
            .from('ad')
            .insert([
                {title, price, description, expire_time, postal_code, location: location, category_id, lat, lng, user_id: admin_id}
            ])
            .select()
        
        if (newListing.status == 400) {
            const error = new Error(newListing.error.message)
            error.status = 400
            throw error;
        }   

        const newlyCreatedListing = newListing.data[0]

        //adding images now to image table after getting the ad id
        const postImages = await supabase
            .from('image')
            .insert(images.map(imagePath => ({ ad_id: newlyCreatedListing.id, file_path: `${process.env.SUPABASE_STORAGE_CDN_URL}/${imagePath}` })));

        if (postImages.status == 401) {
            const error = new Error(postImages.error.message)
            error.status = 401
            throw error;
        }

        const fetNewListing = await supabase
            .from('ad')
            .select(
                `
                *,
                image (file_path),
                category (name),
                status (type),
                profile (name)
                `
            )
            .eq('id', newlyCreatedListing.id);
            
        // return status 200 with success message
        res.status(201).json(fetNewListing.data[0])
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminDeleteListing(req, res) {
    let {user_id, listingInfoArr} = req.body

    try {
        listingInfoArr.forEach(async (listing, index) => {
            const getListing = await supabase
                .from('ad')
                .select(
                    `
                    *,
                    image!left(file_path)
                    `
                )
                .eq('id', listing.id)

            //delete the ad listing from ad table
            const deleteListing = await supabase
                .from('ad')
                .delete()
                .match({ 'id': listing.id });

            if (deleteListing.error?.message) {
                const error = new Error(deleteListing.error.message)
                error.status = 409
                throw error;
            }

            //delete the images form the image table for the ad
            const listingImages = await supabase
                .from('image')
                .delete()
                .eq( 'ad_id', listing.id )

            if (listingImages.error?.message) {
                const error = new Error(listingImages.error.message)
                error.status = 409
                throw error;
            }
            
            //delete the images from the supabase bucket/storage
            for (let i of getListing.data[0].image) {
                const file_path = i.file_path.split('/').pop()

                const { error } = await supabase
                    .storage
                    .from('ad-listings')
                    .remove([file_path])
                
                if (error) {
                    const err = new Error("Unable to delete Image from the bucket")
                    err.status = 500
                    throw err;
                }
            }
        })

        res.status(204).json({message: "Listings Deleted Successfully!"})
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminUpdateListing(req, res) {
    const {listingInfo} = req.body

    try {

        let err = validateFormData({...listingInfo})

        if (Object.keys(err).length !== 0) {
            const error = new Error("Bad form data !")
            error.status = 422
            throw error;
        }

        const getOrigninalListingInfo = await supabase
            .from('ad')
            .select(
                `
                *,
                image!left(file_path),
                category!inner(name),
                status!inner(type)
                `
            )
            .eq('id', listingInfo.id);
            
        const originalListingImages = await supabase
            .from('image')
            .select('file_path')
            .eq( 'ad_id', listingInfo.id )
        
            //update the ad listing from ad table
            const newListing = await supabase
            .from('ad')
            .update({title: listingInfo.title, price: listingInfo.price, description: listingInfo.description, expire_time: listingInfo.expire_time, postal_code: listingInfo.postal_code, location: listingInfo.location, category_id: listingInfo.category_id, status_id: listingInfo.status_id})
            .eq('id', listingInfo.id)
            .select()

        //adding newly uploaded images now to image table
        const newImagesWithoutUrls = listingInfo.image.filter(singleNewImage => typeof singleNewImage === 'string' && !singleNewImage.startsWith('http')) 
        const postNewUpdatedImages = await supabase
            .from('image')
            .insert(newImagesWithoutUrls.map(imagePath => ({ ad_id: listingInfo.id, file_path: `${process.env.SUPABASE_STORAGE_CDN_URL}/${imagePath}` })));
        

            
        //get the original images in array form and deleting the oringalimages by comparing it with new images
        //add any new images that dont have the http url yet as url in image table. new image are sent as bucket path only
        const originalImages = [...originalListingImages.data.map(item => item.file_path)]
        
        for (let imageUrl of originalImages) {
            if (listingInfo.image.indexOf(imageUrl) === -1) {

                const file_path = imageUrl.split('/').pop()

                //delete from bucket
                const deleteImageFromBucket = await supabase
                    .storage
                    .from('ad-listings')
                    .remove([file_path])
                                        
                if (deleteImageFromBucket.error?.message) {
                    const err = new Error("Unable to delete Image from the bucket")
                    err.status = 500
                    throw err;
                }

                //delete from image table
                //delete the images form the image table for the ad
                const deleteImageFromImageTable = await supabase
                    .from('image')
                    .delete()
                    .eq( 'file_path', imageUrl )
                

                if (deleteImageFromImageTable.error?.message) {
                    const error = new Error(deleteImageFromImageTable.error.message)
                    error.status = 409
                    throw error;
                }
            }
        }

        const returnupdatedListing = await supabase
        .from('ad')
        .select(
            `
            *,
            image!left(file_path),
            category!inner(name),
            status!inner(type),
            profile!inner(name)
            `
        )
        .eq('id', listingInfo.id);

        res.status(201).json(returnupdatedListing.data[0])
    }

    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminGetAllUsers(req, res) {
    try {
        const allUsers = await supabase
            .from('profile')
            .select('*')
            .order('id', { ascending: false });
        
        if (allUsers.status == 400) {
            const error = new Error(allUsers.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(allUsers.data)
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminUpdateUser(req, res) {
    let {updatedUser} = req.body

    try {
        const allUsers = await supabase
            .from('profile')
            .select('*')
            .order('id', { ascending: false });
        
        const updateUser = await supabase
            .from('profile')
            .update({name: updatedUser.name, postal_code: updatedUser.postal_code, first_name: updatedUser.first_name, last_name: updatedUser.last_name, student_number: updatedUser.student_number})
            .eq('id', updatedUser.id)
            .select()

        if (updateUser.status == 400) {
            const error = new Error(updateUser.error.message)
            error.status = 400
            throw error;
        }

        res.status(201).json(updateUser.data[0])
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminGetQueryUsers(req, res) {
    let queryValues = req.query

    try {

        const matchingQuery = {}

         //filter the records based on the query params
         if (queryValues) {
            // Loop through the queryParams object and add filters
            Object.entries(queryValues).forEach(([key, value]) => {
                if (value !== 'undefined') {
                    matchingQuery[key] = value
                }
            });
        }
        
        //selecting all records
        const queriedListing = await supabase
            .from('profile')
            .select('*')
            .match(matchingQuery)
            .order('id', { ascending: false });

        if (queriedListing.status == 400) {
            const error = new Error(queriedListing.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(queriedListing.data)
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminGetAllAdminUsers(req, res) {
    try {
        const allUsers = await supabase
            .from('admin_users')
            .select('*, profile (name)')
            .order('id', { ascending: false });
        
        if (allUsers.status == 400) {
            const error = new Error(allUsers.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(allUsers.data)
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminGetQueryAdminUsers(req, res) {
    let queryValues = req.query

    try {

        const matchingQuery = {}

         //filter the records based on the query params
         if (queryValues) {
            // Loop through the queryParams object and add filters
            Object.entries(queryValues).forEach(([key, value]) => {
                if (value !== 'undefined') {
                    matchingQuery[key] = value
                }
            });
        }
        
        //selecting all records
        const queriedListing = await supabase
            .from('admin_users')
            .select('*, profile (name)')
            .match(matchingQuery)
            .order('id', { ascending: false });

        if (queriedListing.status == 400) {
            const error = new Error(queriedListing.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(queriedListing.data)
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function adminAddNewAdmin(req, res) {


    let {newUser_id} = req.body

    try {        
        const newAdmin = await supabase
            .from('admin_users')
            .insert([
                {user_id: newUser_id}
            ])
        .select('*, profile (name)')

        if (newAdmin.status == 400) {
            const error = new Error(newAdmin.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(newAdmin.data[0])
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }

}

export async function adminDeleteAdminAccess(req, res) {
    let { users } = req.body;

    try {
        for (const user of users) {
            const findAdminRecord = await supabase
                .from('admin_users')
                .select('*')
                .eq('id', user.id);

            if (findAdminRecord.data[0].user_id !== user.user_id) {
                const error = new Error("Invalid Deletion Check!");
                error.status = 422;
                throw error;
            }

            const deleteAdminAccess = await supabase
                .from('admin_users')
                .delete()
                .match({ 'id': user.id });
        }

        res.status(204).json({ message: "Admin Privileges revoked for user!" });
    }
    catch(error) {
        const status = error?.status || 500;
        res.status(status).json({ message: error.message });
    }
}

export async function adminDeleteUser(req, res) {

    let {userArr} = req.body

    try {

        for (let user of userArr) {

            const deleteFromUsersTable = await supabase.auth.admin.deleteUser(
                user.id
            )
    
            if (deleteFromUsersTable.status == 500 || deleteFromUsersTable.status == 409) {
                const error = new Error(deleteFromUsersTable.error.message)
                error.status = 500
                throw error;
            }
    
            const deleteUserFromProfileTable = await supabase
                .from('profile')
                .delete()
                .eq('id', user.id )
            
            if (deleteUserFromProfileTable.status == 409) {
                const error = new Error(deleteUserFromProfileTable.error.message)
                error.status = 409
                throw error;
            }
        }
        

        if (userArr.length === 1) res.status(200).json({message: `User ${userArr[0].name} successfully deleted!`})
        else res.status(204).json({message: `All selected users successfully deleted!`})
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}