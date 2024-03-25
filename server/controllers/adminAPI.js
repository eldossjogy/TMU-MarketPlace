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

    const {title, price, description, expire_time, postal_code, location, category_id, user_id, images, lat, lng} = req.body
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
                {title, price, description, expire_time, postal_code, location: location, category_id, lat, lng, user_id}
            ])
            .select()

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
