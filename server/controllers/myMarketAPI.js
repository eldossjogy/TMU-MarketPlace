import supabase from '../config/supabaseConfig.js'
import dotenv from "dotenv";

export async function createListing(req, res) {

    const {title, price, description, expire_time, postal_code, location, category_id, user_id, images} = req.body
    try {
        //need .select at the end to get the created data and use its id for new image POST req
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

        // return status 200 with success message
        res.status(201).json({message: "New Listing added successfully"})
    }
    catch(error) {
        if(error.status === 401) {
            res.status(401).json({ message: error.message});
        }
        else {
            res.status(500).json({ message: error.message });
        }
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
                image!inner(file_path),
                category!inner(name),
                status!inner(type)
                `
            );

            res.status(200).json(updatedListing.data[0])
        }
    }
    catch(error) {
        console.log(error)
        res.status(error.status).json({ message: error.message });
    }
}
