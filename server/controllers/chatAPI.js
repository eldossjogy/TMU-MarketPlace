import supabase from "../config/supabaseConfig.js";

export async function getUserChat(req, res) {
    let { user_id } = req.body;
    try {
        if (!user_id) {
            throw new Error("Missing an input query");
        }
        const { data, error } = await supabase
            .from("messages")
            .select(`
                    id,
                    message,
                    sender_id,
                    sender:profile!public_messages_sender_id_fkey(name),
                    recipient_id,
                    recipient:profile!public_messages_recipient_id_fkey(name),
                    created_at,
                    ad_post,
                    is_read
                    `)

            .or(`recipient_id.eq.${user_id},sender_id.eq.${user_id}`)
            .order('created_at', { ascending: true });

        if (error) throw new Error(error.message)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// send message
export async function sendMessage(req, res) {
    let { recipient_id, list_id, init_msg, user_id } = req.body;
    try {
        if (!recipient_id || !list_id || !init_msg || !user_id) {
            throw new Error("Missing an input query");
        }
        const { data, error } = await supabase
            .from("messages")
            .insert([
                {
                    recipient_id: recipient_id,
                    sender_id: user_id,
                    ad_post: list_id,
                    message: init_msg,
                },
            ])
            .select();
        if (error) throw new Error(error.message)
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// set a current chat which will remove notifications
export async function updateReadStatus(req, res) {
    let { user_id, ad_post } = req.body
    try {
        if (!user_id || !ad_post) {
            throw new Error("Missing an input query");
        }
        const { data, error } = await supabase
            .from("messages")
            .update({ is_read: true })
            .eq("recipient_id", user_id)
            .eq("ad_post", ad_post)
            .select();
        if (error) throw new Error(error.message)
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
