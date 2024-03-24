import React, { useState } from 'react';
import MyMarketContainer from '../components/MyMarketContainer';
import HorizontalCardInbox from '../components/HorizontalCardInbox';
import Chatbox from '../components/Chatbox';

export default function CreateListings() {

    const [chats, setChats] = useState([{id: 1, title: "Cat!"}, {id: 2, title: "Bear!"}, {id: 3, title: "Frog!"}, {id: 4, title: "Turtle!"}, {id: 5, title: "Duck!"}]);
    return (
        <MyMarketContainer title={"Your Inbox"}>
            <h1 className='w-full shrink-0 text-5xl p-4'>Inbox</h1>
            <section className='flex flex-wrap lg:flex-nowrap p-3 gap-3'>
                {/* Toolbar with sorting and title and stuff */}
                <div className='space-y-3 w-full lg:w-[60%]'> 
                    <HorizontalCardInbox
                        image={[{file_path: "https://jjcsqjjvzatkopidmaha.supabase.co/storage/v1/object/public/ad-listings/9e831992-2fbd-431f-bd89-d584c844b938_1711229796995.jpg"}]}
                        ad_id={"183"}
                        title={"Cat!"}
                        username={"Aminushki"}
                        status={0}
                        lastMessage={"Hey why havent you called me back yet?"}
                        date={"2024-03-23 17:15:09.935136+00"}>
                    </HorizontalCardInbox>
                    {chats && chats.map((chat) => (
                        <HorizontalCardInbox
                            image={[{file_path: "https://jjcsqjjvzatkopidmaha.supabase.co/storage/v1/object/public/ad-listings/9e831992-2fbd-431f-bd89-d584c844b938_1711229796995.jpg"}]}
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
                <Chatbox chatID={0}/>
            </section>
        </MyMarketContainer>
    );
}