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
        is_read,
        chats!inner(ad_id)
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

export async function getChats(req, res) {
  const { user_id } = req.body;
  const { inbox } = req.query;
  try {
    if (!user_id) {
      throw new Error("Missing an input query");
    }

    const { data, error } = await supabase
      .from("chats")
      .select(
        `*, 
        ad!inner(title, price, image!left(file_path), profile!left(name))`
      )
      .eq(parseInt(inbox) === 1 ? 'user2_id' : 'user1_id', user_id) // If inbox, load all chats where someone sent to user, else load all chats where user sent to someone
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getChat(req, res) {
  const { user_id } = req.body;
  const { chat_id } = req.query;
  try {
    if (!user_id || !chat_id) {
      throw new Error("Missing an input query");
    }

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        message,
        sender_id,
        sender:profile!public_messages_sender_id_fkey(name, avatar_url),
        recipient_id,
        recipient:profile!public_messages_recipient_id_fkey(name, avatar_url),
        created_at,
        is_read,
        chats!inner(ad_id)
        `
      )
      .eq('chat_id' , chat_id) // If inbox, load all chats where someone sent to user, else load all chats where user sent to someone
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Basically tries to add otherwise tries to fetch with 2 selects because constraint
// Checks for a chat id where user1 is sender and user2 is recipient with a given ad id
async function getChatID(sender, recipient, ad_id) {
  const { data: chatID, error: chatError } = await supabase
    .from("chats")
    .insert([
      {
        user1_id: sender,
        user2_id: recipient,
        ad_id: ad_id,
      },
    ])
    .select();
  if (chatID?.length > 0) {
    return chatID;
  }
  if (chatError.code !== "23505") {
    throw chatError;
  }
  const { data: firstSearchData, error: firstSearchError } = await supabase
    .from("chats")
    .select("*")
    .eq("user1_id", sender)
    .eq("user2_id", recipient)
    .eq("ad_id", ad_id);
  console.log(`firstSearchData: ${JSON.stringify(firstSearchData)} | firstSearchError: ${JSON.stringify(firstSearchError)}`);
  if (firstSearchData?.length > 0) {
    return firstSearchData;
  }
  if (firstSearchError) {
    throw firstSearchError;
  }
  // const { data: secondSearchData, error: secondSearchError } = await supabase
  //   .from("chats")
  //   .select("*")
  //   .eq("user1_id", user2_id)
  //   .eq("user2_id", user1_id)
  //   .eq("ad_id", ad_id);
  // if (secondSearchData && secondSearchData.length > 0) {
  //   return secondSearchData;
  // }
  // if (secondSearchError) {
  //   throw secondSearchError;
  // }
  return new Error("Something went wrong");
}

// send message
export async function sendMessage(req, res) {
  const { list_id, init_msg, user_id } = req.body;
  try {
    const { data: recipient_data, error: recipient_data_error } = await supabase.from('ad').select('user_id').eq('id', list_id);

    if(!recipient_data){
      throw new Error("Cannot send a message to deleted or missing user.");
    }
    else if(recipient_data_error) throw recipient_data_error;

    const recipient_id = recipient_data[0].user_id;

    if (!recipient_id || !list_id || !init_msg || !user_id) {
      throw new Error("Missing an input query");
    }
    if (recipient_id === user_id) {
      throw new Error("Cannot send a message to yourself.");
    }

    let chat_id = null;
    let chatID = await getChatID(user_id, recipient_id, list_id);

    if (chatID && chatID.length > 0) {
      chat_id = chatID[0].id;
      //res.status(200).json({chatID, chat_id});
    } else {
      throw new Error("NO CHAT ID");
    }

    console.log(init_msg);

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
    console.log(data);
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
    if (!user_id || !chat_id) {
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
