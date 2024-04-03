import supabase from "../config/supabaseConfig.js";

export async function getUserChat(req, res) {
  let { user_id } = req.body;
  try {
    if (!user_id) {
      throw new Error("Missing an input query");
    }
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
                    id,
                    message,
                    sender_id,
                    sender:profile!public_messages_sender_id_fkey(name),
                    recipient_id,
                    recipient:profile!public_messages_recipient_id_fkey(name),
                    created_at,
                    chat_id,
                    is_read
                    `
      )

      .or(`recipient_id.eq.${user_id},sender_id.eq.${user_id}`)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Basically tries to add otherwise tries to fetch with 2 selects because constraint
async function getChatID(user1_id, user2_id, ad_id) {
  const { data: chatID, error: chatError } = await supabase
        .from("chats")
        .insert([
        {
            user1_id: user1_id,
            user2_id: user2_id,
            ad_id: ad_id,
        },
        ])
        .select();
    if (chatID && chatID.length > 0) {return chatID}
    if (chatError.code !== "23505") {return new Error(error.message)}
    const { data: firstSearchData, error: firstSearchError } = await supabase
        .from("chats")
        .select("*")
        .eq("user1_id", user1_id)
        .eq("user2_id", user2_id)
        .eq("ad_id", ad_id);
    if (firstSearchData && firstSearchData.length > 0) {return firstSearchData}
    if (firstSearchError) {return new Error(firstSearchError)}
    const { data: secondSearchData, error: secondSearchError } = await supabase
        .from("chats")
        .select("*")
        .eq("user1_id", user2_id)
        .eq("user2_id", user1_id)
        .eq("ad_id", ad_id);
    if (secondSearchData && secondSearchData.length > 0) {return secondSearchData}
    if (secondSearchError) {return new Error(secondSearchError)}
    return new Error("NOTHING WORKED")
}

// send message
export async function sendMessage(req, res) {
  let { recipient_id, list_id, init_msg, user_id } = req.body;
  try {
    if (!recipient_id || !list_id || !init_msg || !user_id) {
      throw new Error("Missing an input query");
    }
    let chat_id = null
    let chatID = await getChatID(user_id, recipient_id, list_id);
    if (chatID && chatID.length > 0){ chat_id = chatID[0].id} else{ throw new Error("NO CHAT ID")}
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          recipient_id: recipient_id,
          sender_id: user_id,
          chat_id: chat_id,
          message: init_msg,
        },
      ])
      .select();
    if (error) throw new Error(error.message);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// set a current chat which will remove notifications
export async function updateReadStatus(req, res) {
  let { user_id, chat_id } = req.body;
  try {
    if (!user_id || !ad_post) {
      throw new Error("Missing an input query");
    }
    const { data, error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("recipient_id", user_id)
      .eq("chat_id", chat_id)
      .select();
    if (error) throw new Error(error.message);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
