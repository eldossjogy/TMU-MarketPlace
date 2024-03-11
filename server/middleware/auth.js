import supabase from "../config/supabaseConfig.js"

export const verifyToken = async (req, res, next) => {

    const userToken = req.header("Authorization").split(' ')[1]
    if (userToken) {
        try {
            const output = await supabase.auth.getUser(userToken)
            
            const user = output.data.user

            req.body.user_id = user.id

            return next()
        }
        catch(error) {
            res.status(403).json({ message: "Access Denied - Unauthorized!!" })
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized Access!!" })
    }

}