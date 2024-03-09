import supabase from '../config/supabaseConfig.js'

export async function registerAccountDetails(req, res) {
    let {name, student_number, user_id, email, postal_code, role_id} = req.body
    try {
        const res = await supabase
        .from('user')
        .insert({
            user_id,
            name,
            student_number,
            email,
            postal_code,
            role_id
        })
        res.status(200).json({message:"User record inserted to user table"})
    }
    catch (error) {
        res.status(500).json({ message: "Cannot enter user information to db" });
    }

}