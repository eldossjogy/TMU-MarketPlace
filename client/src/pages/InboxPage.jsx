import React, { useContext, useState } from 'react';
import MyMarketContainer from '../components/MyMarketContainer';
import HorizontalCardInbox from '../components/HorizontalCardInbox';
import Chatbox from '../components/Chatbox';
import ChatContext from "../authAndContext/chatProvider";

export default function CreateListings() {
    const { sentMsg, getChat, messages, removeNotification, currentChat, gotMail, exitChat } = useContext(ChatContext)
    const [chats, setChats] = useState([{ id: 1, title: "Cat!" }, { id: 2, title: "Bear!" }, { id: 3, title: "Frog!" }, { id: 4, title: "Turtle!" }, { id: 5, title: "Duck!" }]);

    const [formData, setFormData] = useState({
        list_id: null,
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

        sentMsg(formData.list_id, formData.init_msg);
    }

    return (
        <MyMarketContainer title={"Your Inbox"}>
            <h1 className='w-full shrink-0 text-5xl p-4'>Inbox</h1>
            <section className='flex flex-wrap lg:flex-nowrap p-3 gap-3'>
                {/* Toolbar with sorting and title and stuff */}
                <div className='space-y-3 w-full lg:w-[60%]'>
                    <HorizontalCardInbox
                        image={[{ file_path: "https://jjcsqjjvzatkopidmaha.supabase.co/storage/v1/object/public/ad-listings/9e831992-2fbd-431f-bd89-d584c844b938_1711229796995.jpg" }]}
                        ad_id={"183"}
                        title={"Cat!"}
                        username={"Aminushki"}
                        status={0}
                        lastMessage={"Hey why havent you called me back yet?"}
                        date={"2024-03-23 17:15:09.935136+00"}>
                    </HorizontalCardInbox>
                    {chats && chats.map((chat) => (
                        <HorizontalCardInbox
                            image={[{ file_path: "https://jjcsqjjvzatkopidmaha.supabase.co/storage/v1/object/public/ad-listings/9e831992-2fbd-431f-bd89-d584c844b938_1711229796995.jpg" }]}
                            ad_id={"183"}
                            title={"Cat!"}
                            username={"Aminushki"}
                            status={0}
                            lastMessage={"Hey why havent you called me back yet?"}
                            date={"2024-03-22 17:15:09.935136+00"}
                            key={chat.id}>
                        </HorizontalCardInbox>
                    ))}
                </div>
                <Chatbox chatID={0} />
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
            </section>
        </MyMarketContainer>
    );
}