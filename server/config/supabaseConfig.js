import {createClient} from '@supabase/supabase-js'

const supabase = supabaseClient.createClient({
    apiKey: process.env.SUPABASE_KEY, 
    project: process.env.SUPABASE_URL
});

export default supabase
