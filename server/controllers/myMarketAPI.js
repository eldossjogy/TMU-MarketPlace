import supabase from '../config/supabaseConfig.js'

export async function createListing(req, res) {

    try {
        //need .select at the end to get the created data and use its id for new image POST req
        const newListing = await supabase
            .from('ad')
            .insert([{...req.body}])
            .select()

        if (newListing.status == 401) {
            const error = new Error(newListing.error.message)
            error.status = 401
            throw error;
        }
        else {
            res.status(200).json(newListing.data)
        }
        
    }
    catch(error) {
        console.log(error)
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
            .select()
            .eq('user_id', user_id)

        res.status(200).json(myListings)
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
}