import supabase from '../config/supabaseConfig.js'
import dotenv from "dotenv";

export async function searchAds(req, res) {

    const {q, user, lng, lat, min, max} = req.query;
    try {

        if(user){
            var { data, error } = await supabase.from('ad').select(`id, title, price, description, longitude, latitude, created_at, status_id, image!inner(file_path), category!inner(name), status!inner(type)`)
            .eq('user_id', user)
            .textSearch('title', q, { type: 'websearch', config: 'english' })
        }
        else if (q) {
            var { data, error } = await supabase.from('ad').select(`id, title, price, description, longitude, latitude, created_at, status_id, image!inner(file_path), category!inner(name), status!inner(type)`)
            .filter('price','gte', parseInt(min) ? `${parseInt(min)}` : '0')
            .filter('price','lte', parseInt(max) ? `${parseInt(max)}` : '2147483647')
            .textSearch('title', q, { type: 'websearch', config: 'english' })
        }
        else{
            var { data, error } = await supabase.from('ad').select(`id, title, price, description, longitude, latitude, created_at, status_id, image!inner(file_path), category!inner(name), status!inner(type)`)
            .filter('price','gte', parseInt(min) ? `${parseInt(min)}` : '0')
            .filter('price','lte', parseInt(max) ? `${parseInt(max)}` : '2147483647')
        }

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
            data: data,
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