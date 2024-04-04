import React, { useContext, useState } from "react";
import ChatContext from "../authAndContext/chatProvider";

export default function ChatModal({ recipient_id, ad_post }) {
  const { sentMsg } = useContext(ChatContext);

  const [initialMessage, setInitialMessage] = useState("Still Available?");

  function createChat(e) {
    e.preventDefault();
    // console.log(recipient_id,ad_post,initialMessage);
    sentMsg(recipient_id, ad_post, initialMessage);
  }

  return (
    <div className="flex justify-center items-center my-3 mx-3">
      <div className="bg-card p-3 rounded-lg w-full max-w-2xl shadow-md text-center">
        <form onSubmit={createChat} className="mb-8">
          <div className="mb-4">
            <label htmlFor="init_msg" className="block mb-1 text-sm">
              Send Message
            </label>
            <input
              type="text"
              id="init_msg"
              name="init_msg"
              placeholder="Inital Message"
              value={initialMessage}
              onChange={(e) => {
                setInitialMessage(e.target.value);
              }}
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
    </div>
  );
}
