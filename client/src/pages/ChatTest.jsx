import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ChatContext from "../authAndContext/chatProvider";
import AuthContext from "../authAndContext/contextApi";

export default function ChatTest() {
  const { sentMsg, getChat, messages, removeNotification, currentChat, gotMail, exitChat } = useContext(ChatContext)
  const { user } = useContext(AuthContext)
  const [reply,setReply] =useState({id: null, ad_id: null})
  useEffect(() => { getChat() }, [user])

  /* call on unmount */
  useEffect(() => {
    return () => {
      exitChat()
    };
  }, []); // Empty dependency array means this effect runs only once (on mount) and cleans up on unmount

  useEffect(()=>{console.log(reply)},[reply])

  const [formData, setFormData] = useState({
    list_id: null,
    recipient_id: null,
    init_msg: "Still Available?",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  function createChat(e) {
    e.preventDefault();

    sentMsg(formData.recipient_id, formData.list_id, formData.init_msg);
  }

  async function readChat(e) {
    e.preventDefault();
    getChat();
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto">
        <form onSubmit={createChat} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Create/Send Chat</h2>
          <div className="mb-4">
            <label htmlFor="list_id" className="block mb-1 text-sm">
              Listing ID
            </label>
            <input
              type="text"
              id="list_id"
              name="list_id"
              placeholder="Enter Listing ID"
              onChange={handleChange}
              value={formData.list_id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="recipient_id" className="block mb-1 text-sm">
              recipient_id
            </label>
            <input
              type="text"
              id="recipient_id"
              name="recipient_id"
              placeholder="Enter recipient_id"
              onChange={handleChange}
              value={formData.recipient_id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="init_msg" className="block mb-1 text-sm">
              Inital Message
            </label>
            <input
              type="text"
              id="init_msg"
              name="init_msg"
              placeholder="Inital Message"
              value={formData.init_msg}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Create/Send Chat
          </button>
        </form>
      </div>

      Currently reading {currentChat}

      {messages && Array.from(new Set(messages.map(message => message.chat_id))).map((adPost, index) => {
        return (
          <button
            type="submit"
            className={`text-white font-semibold py-2 px-4 rounded-lg mr-2 ${currentChat === adPost
                ? 'bg-amber-400 hover:bg-amber-700'
                : gotMail.some(obj => obj.chat_id === adPost)
                  ? 'bg-red-500 hover:bg-red-700'
                  : 'bg-blue-500 hover:bg-blue-700'
              }`}

            key={index}
            onClick={() => {
              removeNotification(user.id, adPost)
            }}
          >{adPost}</button>
        )
      })}

      {messages && messages.map((ele) => {
        if (currentChat == ele.chat_id) {
          if (reply.id != ele.sender_id && ele.sender_id != user.id){
            setReply((prev)=>({ad_id: ele?.chats?.ad_id,id:ele.sender_id}))
            setFormData((prev)=>({...prev,list_id: ele?.chats?.ad_id,recipient_id:ele.sender_id}))
          }
          return (
            <div key={ele.id}>
              {ele.chat_id} -- {ele?.chats?.ad_id} -- {ele.sender?.name} - ={ele.sender_id}= - {ele.message}
            </div>
          );
        }
      })}
    </>
  );
}
