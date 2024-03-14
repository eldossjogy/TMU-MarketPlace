import supabase from '../config/supabaseConfig.js'
import dotenv from "dotenv";

export async function searchAds(req, res) {

    const {q, user, lng, lat} = req.query;
    try {
        // return status 200 with success message
        // const { data, error } = await supabase.from('ad').select().textSearch('title', q, {
        //     type: 'websearch',
        //     config: 'english'
        // });

        
        const { data, error } = user ? 
            await supabase.from('ad').select(
                 `
        id,
        title,
        price,
        description,
        postal_code,
        longitude,
        latitude,
        post_time,
        status_id,
        created_at,
        image!inner(file_path),
        category!inner(name),
        status!inner(type)
        `
            ).eq('user_id', user)
                .textSearch('title', q, { type: 'websearch', config: 'english' })
            : q ? ( await supabase.from('ad').select( `
            id,
            title,
            price,
            description,
            postal_code,
            longitude,
            latitude,
            post_time,
            status_id,
            created_at,
            image!inner(file_path),
            category!inner(name),
            status!inner(type)
            `).textSearch('title', q, { type: 'websearch', config: 'english' }) )
                : ( await supabase.from('ad').select( `
                id,
                title,
                price,
                description,
                postal_code,
                longitude,
                latitude,
                post_time,
                status_id,
                created_at,
                image!inner(file_path),
                category!inner(name),
                status!inner(type)
                `))

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