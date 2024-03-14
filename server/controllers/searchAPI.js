import supabase from '../config/supabaseConfig.js'
import dotenv from "dotenv";

export async function searchAds(req, res) {

    const {q} = req.params;
    try {
        // return status 200 with success message
        const { data, error } = await supabase.from('ad').select().textSearch('title', q, {
            type: 'websearch',
            config: 'english'
        });

        if(error){
            res.status(500).json({
                data: null,
                error: {
                    message: "Search Failed.", 
                    error: error 
                }
            });
            return;
        }

        res.status(200).json({
            data: {
                data: data,
                message: "hi"
            },
            error: null
        });
    }
    catch(error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
} 

/*
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
*/