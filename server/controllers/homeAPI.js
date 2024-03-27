import supabase from '../config/supabaseConfig.js'
import dotenv from "dotenv";

export async function getCategories(req, res) {
    try {
        const categories = await supabase
            .from('category')
            .select('id, name')

        res.status(200).json(categories.data)
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getStatusList(req, res) {
    try {
        const statusList = await supabase
            .from('status')
            .select('id, type')

        res.status(200).json(statusList.data)
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
}
