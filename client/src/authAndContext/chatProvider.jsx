import React, { useState, useEffect, createContext, useContext } from "react";
import supabase from "./supabaseConfig";
import AuthContext from "./contextApi";
import toast from "react-hot-toast";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // fetch the current logged in user
  const { user, localSession } = useContext(AuthContext);
  // create a supabase channel for them
  const [currentChannel, setChannel] = useState(null);
  // collects all the messages from and sent by the user
  const [messages, setMessages] = useState([]);
  // only new mail
  const [newMsg, setNewMsg] = useState(false);
  // list of new mails that need notification
  const [gotMail, setGotMail] = useState([]);
  // current chat user is reading
  const [currentChat, setCurrentChat] = useState(null);

  // create/connect to users channel (can be moved to one useEffect in AuthContext)
  useEffect(() => {
    if (user && user.id) {
      let userChannel = supabase.channel(user.id);
      setChannel(userChannel);
    }
  }, [user]);

  // listen to a chatroom
  useEffect(() => {
    const msgSubscription = supabase
      .channel(currentChannel)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (
            [payload.new.recipient_id, payload.new.sender_id].includes(user?.id)
          ) {
            let newMsg = payload.new;
            setMessages((prev) => {
              const alreadyExist = prev.some((msg) => msg.id == newMsg.id);
              if (!alreadyExist) {
                return [...prev, newMsg];
              }
            });
            setNewMsg(newMsg);
          }
        }
      )
      .subscribe();
    // Cleanup function to unsubscribe from the channel when the component unmounts
    // return () => {
    // supabase.removeSubscription(messagesSubscription);
    // };
  }, [currentChannel]); // Empty dependency array means this effect runs once on mount

  // onMount of the chatpage we can read all chats
  async function getChat() {
    if (!user || messages.length > 0) {
      return toast.error("Chat :> No user data at the moment")
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/all`,
        {
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      );
      response.data.forEach((ele) => {
        if (!ele.is_read && ele.recipient_id === user.id) {
          setGotMail((prev) => [...prev, ele]);
        }
      });
      setMessages(response.data)
    } catch (error) {
      toast.error("Error fetching ads: ", JSON.stringify(error));
      return null;
    }
  }

  // send message
  async function sentMsg(recipient_id, list_id, init_msg) {
    if (!user) {
      return toast.error("Chat :> No user data at the moment")
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/message`,
        {
          recipient_id: recipient_id,
          list_id: list_id,
          init_msg: init_msg
        },
        {
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      );
      console.log(response)
      if (response.data) {
        return toast.success("Chat :> Send Message")
      }
    } catch (error) {
      return toast.error("Chat :> Failed to send message", error.message)
    }
  }

  // setCurrentChat

  /* add notification */
  useEffect(() => {
    if (messages.length > 0 && newMsg) {
      if (newMsg.recipient_id === user.id) {
        if (newMsg.ad_post === currentChat) {
          updateDBReadStatus(user.id, currentChat);
          return toast.success("Chat :> No notifacation because u are already reading the chat");
        }
        setGotMail((prev) => [...prev, newMsg]);
        toast.success("Chat :> You've got mail");
      }
    }
  }, [messages, newMsg]);

  // set a current chat which will remove notifications
  async function updateDBReadStatus(user_id,ad_post) {
    if (!user) {
      return toast.error("Chat :> No user data at the moment")
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/read-status`,
        {
          ad_post: ad_post
        },
        {
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      );
      console.log(response)
      if (response.data) {
        return toast.success("Chat :> DB Read Status Updated")
      }
    } catch (error) {
      return toast.error("Chat :> Failed to send message", error.message)
    }

  }

  /* remove notification */
  /* find out if the message has been read */
  /* must have ad_id and message_id and user_id */
  async function removeNotification(user_id, ad_post) {
    toast.success("Chat :> You're reading the chat for ad post: ", ad_post);
    setCurrentChat(ad_post); // if the user has unread messages
    if (gotMail.length === 0) {     // if the user has unread messages
      return toast.success("Chat :> No New Mail");;
    }

    if (user_id === user.id) {
      // update teh notification
      setGotMail((prev) => {
        let updatedArray = prev.filter((dict) => dict.ad_post !== ad_post);
        return updatedArray;
      });

      // update teh database
      updateDBReadStatus(user.id, ad_post);
    }
  }

  // stop reading

  async function exitChat() {
    toast.success("Chat :> You've stoped reading the chat for ad post: ", currentChat);
    setCurrentChat(null);
  }

  return (
    <ChatContext.Provider
      value={{
        sentMsg,
        getChat,
        messages,
        newMsg,
        gotMail,
        removeNotification,
        currentChat,
        exitChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;