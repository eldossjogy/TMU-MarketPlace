import supabase from "../config/supabaseConfig.js"

export const verifyToken = async (req, res, next) => {
    const userToken = req.header("Authorization")
    if (userToken) {
        const token = userToken.split(' ')[1]
        try {
            const { data: { user } } = await supabase.auth.getUser(token)
            
            req.body.user_id = user.id

            return next()
        }
        catch(error) {
            console.log(error)
            res.status(403).json({ message: "Access Denied - Unauthorized!!"})
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized Access!!" })
    }

}

export const conditionalVerify = async (req, res, next) => {

    const userToken = req.header("Authorization")
    if (userToken) {
        const token = userToken.split(' ')[1]
        try {
            const { data: { user } } = await supabase.auth.getUser(token)
            
            req.body.user_id = user.id

            return next()
        }
        catch(error) {
            console.log(error)
            return next()
        }
    }
    else {
        return next()
    }

}