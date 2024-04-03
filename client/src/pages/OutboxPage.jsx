import React, { useContext, useEffect, useState } from 'react';
import MyMarketContainer from '../components/MyMarketContainer';
import AuthContext from '../authAndContext/contextApi';
import ChatContext from "../authAndContext/chatProvider";
import ChatList from '../components/ChatList';


export default function CreateListings() {
    const { user } = useContext(AuthContext);
    const { getInbox, sentMsg, inbox } = useContext(ChatContext);

    const [formData, setFormData] = useState({
        list_id: '',
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
        console.log(formData);
        if(!isNaN(parseInt(formData.list_id))) sentMsg(formData.list_id, formData.init_msg).then(getInbox());
    }

    useEffect(() => {
        if(user) getInbox(2);
    }, [user])


    return (
        <MyMarketContainer title={"Your Inbox"}>
            <h1 className='w-full shrink-0 text-5xl p-4'>Outbox</h1>
            <ChatList list={inbox}/>
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
        </MyMarketContainer>
    );
}