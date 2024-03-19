import supabase from '../config/supabaseConfig.js'
import dotenv from "dotenv";

function validateFormData(formData) {
    const errors = {};

    // Title validation
    if (!formData.title.trim()) {
        errors.title = 'Title is required.';
    } else if (formData.title.length > 100) {
        errors.title = 'Title must be at most 100 characters long.';
    }

    // Price validation
    const price = parseFloat(formData.price);
    if (formData.price.length <= 0) {
        formData.price = 0
    }
    else if (isNaN(price)) {
        errors.price = 'Price must be a valid number.';
    }
    else if (price < 0 || price > 100000 || !formData.price.toString().trim()) {
        errors.price = 'Price must be a number between $0 and $100,000.';
    }
    else if (!/^\d+$/.test(formData.price.toString().trim())) {
        errors.price = 'Price must be a valid integer > 0.';
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

    //location validation
    if (formData.location.length > 150) {
        errors.location = 'Location must be at most 150 characters long.';
    }

    return errors;
}

export async function createListing(req, res) {

    const {title, price, description, expire_time, postal_code, location, category_id, user_id, images} = req.body
    try {
        //need .select at the end to get the created data and use its id for new image POST req
        let err = validateFormData({title, price, description, expire_time, postal_code, location, category_id})

        if (Object.keys(err).length !== 0) {
            const error = new Error("Bad form data !")
            error.status = 422
            throw error;
        }
      
        const newListing = await supabase
            .from('ad')
            .insert([
                {title, price, description, expire_time, postal_code, location, category_id, user_id}
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
        console.log(error)
        res.status(error.status).json({ message: error.message });
    }

}

export async function getMyListings(req, res) {
    let {user_id} = req.body
    try {
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
            .eq('user_id', user_id)
            .order('id', { ascending: false });

        if (myListings.status == 400) {
            const error = new Error(myListings.error.message)
            error.status = 400
            throw error;
        }

        res.status(200).json(myListings.data)
    }
    catch(error) {
        res.status(500).json({ message: error.message });
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
        .select('*')
        .eq('id', listing.id)

        if (getListing.data[0].user_id !== user_id) {
            const error = new Error("You don't have permission to delete this post.")
            error.status = 403
            throw error;
        }
        else {
            const response = await supabase
            .from('ad')
            .delete()
            .match({ 'id': listing.id });

            res.status(200).json({message: "Post Deleted Successfully!"})
        }
    }
    catch(error) {
        res.status(error.status).json({ message: error.message });
    }
}
