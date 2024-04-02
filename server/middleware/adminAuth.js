import supabase from "../config/supabaseConfig.js"

export const adminVerifyToken = async (req, res, next) => {

    const userToken = req.header("Authorization")
    if (userToken) {
        const token = userToken.split(' ')[1]
        try {
            const output = await supabase.auth.getUser(token)
            
            const user = output.data.user

            const checkIfUserIsAdmin = await verifyAdmin(user.id)
            
            if (checkIfUserIsAdmin) req.body.admin_id = user.id
            else {
                const error = new Error("Access Denied! You do not have Admin Priviliges!")
                error.status = 403
                throw error;
            }

            return next()
        }
        catch(error) {
            const status = error?.status || 403; // Check if error.status exists, default to 500 if it doesn't
            res.status(status).json({ message: error.message });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized Access! Need to be signed in!" })
    }

}

async function verifyAdmin(user_id) {
    try {
        const checkAdmin = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user_id)
            .order('id', { ascending: false });
        
        if (checkAdmin.data[0]) return true
    }
    catch(error) {
        return false
    }
    return false
}
