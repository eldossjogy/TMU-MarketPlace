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
    else if (price < 0 || price > 100000) {
        errors.price = 'Price must be a number between $0 and $100,000.';
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

    if (isNaN(parseFloat(formData.lat)) || isNaN(parseFloat(formData.lng))){
        errors.coordinates = "Invalid coordinates";
    }

    return errors;
}

export async function createListing(req, res) {

    const {title, price, description, expire_time, postal_code, location, category_id, user_id, images, lat, lng} = req.body
    try {
        //need .select at the end to get the created data and use its id for new image POST req
        let err = validateFormData({title, price, description, expire_time, postal_code, location, category_id, lat, lng})

        if (Object.keys(err).length !== 0) {
            const error = new Error("Bad form data !")
            error.status = 422
            throw error;
        }
      
        const newListing = await supabase
            .from('ad')
            .insert([
                {title, price, description, expire_time, postal_code, location: location, category_id, lat, lng, user_id}
            ])
            .select()

        //if unauthorized (dont need this since using service key to bypass any RLS)
        if (newListing.status == 401) {
            const error = new Error(newListing.error.message)
            error.status = 401
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
                image!left(file_path),
                category!inner(name),
                status!inner(type)
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

export async function getMyListings(req, res) {
    let {user_id} = req.body
    let {categoryId} = req.params

    try {
        const matchCondition = {user_id}

        if(categoryId) matchCondition.category_id = categoryId

        const myListings = await supabase
            .from('ad')
            .select(
                `
                *,
                image!left(file_path),
                category!inner(name),
                status!inner(type)
                `
            )
            .match(matchCondition)
            .order('id', { ascending: false });

        if (myListings.status == 400) {
            const error = new Error(myListings.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(myListings.data)
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function changeListingStatus(req, res) {
    let {user_id, listing, status} = req.body
    try {
        const getStatusId = await supabase
            .from('status')
            .select('id')
            .eq('type', status)
        
        //get chosen status status.id from status table
        const statusId = getStatusId.data[0].id
        
        //confirm if to be updated lisiting is indeed by owner of listing
        const getListing = await supabase
        .from('ad')
        .select('*')
        .eq('id', listing.id)

        if (getListing.data[0].user_id !== user_id) {
            const error = new Error("You don't have permission to update this post.")
            error.status = 403
            throw error;
        }
        else {
            const updatedListing = await supabase
            .from('ad')
            .update({status_id: statusId})
            .eq('id', listing.id)
            .select(
                `
                *,
                image!left(file_path),
                category!inner(name),
                status!inner(type)
                `
            );

            res.status(200).json(updatedListing.data[0])
        }
    }
    catch(error) {
        res.status(error.status).json({ message: error.message });
    }
}

export async function deleteMyListing(req, res) {
    let {user_id, listing} = req.body
    try {
        const getListing = await supabase
        .from('ad')
        .select(
            `
            *,
            image!left(file_path)
            `
        )
        .eq('id', listing.id)

        if (getListing.data[0].user_id !== user_id) {
            const error = new Error("You don't have permission to delete this post.")
            error.status = 403
            throw error;
        }
        else {
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

            res.status(200).json({message: "Post Deleted Successfully!"})
        }
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}

export async function getUserSpecificListingForEdit(req, res) {
    let {user_id} = req.body
    let {adId} = req.params

    try {
        const getListing = await supabase
        .from('ad')
        .select(
            `
            *,
            image!left(file_path),
            category!inner(name),
            status!inner(type)
            `
        )
        .eq('id', adId)

        if (getListing.data[0].user_id !== user_id) {
            const error = new Error("You don't have permission to edit this post.")
            error.status = 403
            throw error;
        }

        res.status(200).json(getListing.data[0])
    }
    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        const msg = error?.message || "Listing is not present in the database!"; 
        res.status(status).json({ errMessage: error.message });
    }
    
}

export async function updateListing(req, res) {

    const {listingInfo, user_id} = req.body

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
            .eq('id', listingInfo.id)

            
        const originalListingImages = await supabase
            .from('image')
            .select('file_path')
            .eq( 'ad_id', listingInfo.id )
        
            
            if (getOrigninalListingInfo.data[0].user_id !== user_id) {
                const error = new Error("You don't have permission to update this Ad Post.")
                error.status = 403
                throw error;
            }
            else {

                //update the ad listing from ad table
                const newListing = await supabase
                    .from('ad')
                    .update({title: listingInfo.title, price: listingInfo.price, description: listingInfo.description, expire_time: listingInfo.expire_time, postal_code: listingInfo.postal_code, location: listingInfo.location, category_id: listingInfo.category_id})
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

                res.status(200).json({message: "Post Updated Successfully!"})
            }
    }

    catch(error) {
        const status = error?.status || 500; // Check if error.status exists, default to 500 if it doesn't
        res.status(status).json({ message: error.message });
    }
}


