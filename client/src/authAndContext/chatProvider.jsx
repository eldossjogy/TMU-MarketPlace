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

  const [inbox, setInbox] = useState([]);

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
          console.log(user,payload.new)
          if (
            [payload.new.recipient_id, payload.new.sender_id].includes(user?.id)
          ) {
            let newMsg = payload.new;
            console.log(newMsg);
            const alreadyExist = messages.some((msg) => msg.id == newMsg.id);
            if (!alreadyExist) {
              setMessages((prev) => [...prev, newMsg]);
              console.log(alreadyExist, "new msg");
            }
            setNewMsg(newMsg);
          }
        }
      )
      .subscribe();
    // Cleanup function to unsubscribe from the channel when the component unmounts
    // return () => {
    //   if (currentChannel) {
    //     supabase.removeChannel(currentChannel);
    //   }
    // };
  }, [currentChannel]); // Empty dependency array means this effect runs once on mount

  // onMount of the chatpage we can read all chats
  async function getChat() {
    // if (!user || messages.length > 0) {
    //   return toast.error("Chat :> No user data at the moment");
    // }

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
      setMessages(response.data);
    } catch (error) {
      toast.error("Error fetching ads: ", JSON.stringify(error));
      return null;
    }
  }

  // send message
  async function sentMsg(chat_id, init_msg) {
    if (!user) {
      return toast.error("No user data, please wait");
      // return Promise.reject('No user data.')
    }
    if (!init_msg) {
      return toast.error("No msg to send");
      // return Promise.reject('No user data.')
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/message`,
        {
          chat_id: chat_id,
          init_msg: init_msg,
        },
        {
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      );
      if (response.data) {
        toast.success("Send Message");
        return Promise.resolve('Success')
      }
      else{
        return Promise.reject('Not sent');
      }
    } catch (error) {
      toast.error("Failed to send message", error.message);
      return Promise.reject('Failed to send message.')
    }
  }

    // send message
    async function createChat(ad_id, init_msg) {
      if (!user) {
        toast.error("No user data at the moment");
        return Promise.reject('No user data.')
      }
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_API_URL}/chat/message`,
          {
            list_id: ad_id,
            init_msg: init_msg,
          },
          {
            headers: {
              Authorization: "Bearer " + localSession.access_token,
            },
          }
        );
        if (response.data) {
          return Promise.resolve('Success')
        }
        else{
          return Promise.reject('Not sent');
        }
      } catch (error) {
        console.log(error.message);
        return Promise.reject('Failed to send message.')
      }
    }

  // setCurrentChat

  /* add notification */
  useEffect(() => {
    if (messages.length > 0 && newMsg) {
      if (newMsg.recipient_id === user.id) {
        if (newMsg.chat_id === currentChat) {
          updateDBReadStatus(user.id, currentChat);
          // toast.success(
          //   "Chat :> No notifacation because u are already reading the chat"
          // );
        }
        setGotMail((prev) => [...prev, newMsg]);
        toast.success("You've got mail");
      }
    }
  }, [messages, newMsg]);

  // set a current chat which will remove notifications
  async function updateDBReadStatus(user_id, chat_id) {
    if (!user) {
      return toast.error("No user data at the moment");
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/read-status`,
        {
          chat_id: chat_id,
        },
        {
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      );
      if (response.data) {
        return toast.success();
      }
    } catch (error) {
      return toast.error("Failed to send message", error.message);
    }
  }

  /* remove notification */
  /* find out if the message has been read */
  /* must have ad_id and message_id and user_id */
  async function removeNotification(chat_id) {
    // toast.success(`Chat :> You're reading the chat: ${chat_id}`);
    setCurrentChat(chat_id); // if the user has unread messages
    if (gotMail.length === 0) {
      // if the user has unread messages
      return 
      // return toast.success(`Chat :> No new message in chat ${chat_id}`);
    }

      // update teh notification
    setGotMail((prev) => {
      let updatedArray = prev.filter((dict) => dict.chat_id !== chat_id);
      return updatedArray;
    });

    // update teh database
    updateDBReadStatus(user.id, chat_id);
  }

  // stop reading

  async function exitChat() {
    // toast.success(`Chat :> You've stoped reading the chat`);
    setCurrentChat(null);
  }

  async function getInbox(useInbox = 1) {
    if (!user) {
      return toast.error("No user data at the moment");
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/inbox`,
        {
          params: {
            inbox: useInbox
          },
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      );
      if (response.data) {
        setInbox(response.data);
      }
    } catch (error) {
      return toast.error("Failed to get inbox", error.message);
    }
  }

  async function loadChat(id) {
    if (!user) {
      return toast.error("No user data at the moment");
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/`,
        {
          params: {
            chat_id: id
          },
          headers: {
            Authorization: "Bearer " + localSession.access_token,
          },
        }
      );
      if (response.data) {
        setInbox(response.data);
      }
    } catch (error) {
      return toast.error("Failed to get inbox", error.message);
    }
  }

  return (
    <ChatContext.Provider
      value={{
        sentMsg,
        createChat,
        getChat,
        messages,
        newMsg,
        gotMail,
        removeNotification,
        currentChat,
        exitChat,
        getInbox,
        inbox
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

