import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ChatContext from "../authAndContext/chatProvider";
import AuthContext from "../authAndContext/contextApi";

export default function ChatTest() {
  const { sentMsg, getChat, messages, removeNotification, currentChat, gotMail, exitChat } = useContext(ChatContext) 
  const { user } = useContext(AuthContext)
  
  useEffect(() => { getChat() }, [user])

  /* call on unmount */
  useEffect(() => {
    return () => {
      exitChat()
    };
  }, []); // Empty dependency array means this effect runs only once (on mount) and cleans up on unmount


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

    sentMsg(formData.recipient_id, formData.list_id, formData.user_id);
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

        {/* <form onSubmit={readChat}>
          <h2 className="text-lg font-semibold mb-4">Read/Send Chat</h2>
          <div className="mb-4">
            <label htmlFor="user_id" className="block mb-1 text-sm">
              user_id
            </label>
            <input
              type="text"
              id="user_id"
              name="user_id"
              onChange={handle2Change}
              value={form2Data.user_id}
              placeholder="Enter user_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg "
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Read/Send Chat
          </button>
        </form> */}
      </div>

      Currently reading {currentChat}

      {messages && Array.from(new Set(messages.map(message => message.ad_post))).map((adPost, index) => {

        if (gotMail.some(obj => obj.ad_post === adPost)) {
          return (
            <button
              type="submit"
              className="bg-red-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mr-2"
              key={index}
              onClick={() => {
                removeNotification(user.id, adPost)
              }}
            >{adPost}</button>
          )
        }
        else {
          return (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mr-2"
              key={index}
              onClick={() => {
                removeNotification(user.id, adPost)
              }}
            >{adPost}</button>
          )
        }


      })}

      {messages && messages.map((ele) => {
        // console.log(ele)
        return (
          <div key={ele.id}>
            {ele.ad_post} -- {ele.sender?.name} - ={ele.sender_id}= - {ele.message}
          </div>
        );
      })}
    </>
  );
}
