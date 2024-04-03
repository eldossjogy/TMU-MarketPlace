import React, { useContext } from 'react';
import HorizontalCardInbox from '../components/HorizontalCardInbox';
import Chatbox from '../components/Chatbox';
import ChatContext from '../authAndContext/chatProvider';

export default function ChatList({list = [], inbox}) {
    const { currentChat } = useContext(ChatContext)

    return (
        <section className='flex flex-wrap lg:flex-nowrap p-3 gap-3'>
            {/* Toolbar with sorting and title and stuff */}
            <div className='space-y-3 w-full lg:w-[60%]'>
                {list?.length !== 0 && list.map((result) => (
                    <HorizontalCardInbox
                        key={result.id}
                        image={result.ad.image}
                        ad_id={result.ad_id}
                        title={result.ad.title}
                        username={result.ad.profile.name}
                        status={result.ad_status}
                        lastMessage={"Hey why havent you called me back yet?"}
                        date={result.created_at}
                        chat_id={result.id}>
                    </HorizontalCardInbox>
                ))}
                {(!list || !(list?.length > 0)) && [1].map((key) => (
                    <div key={key} className="m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">
                        <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                            <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
                                <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">No Messages</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {currentChat && <Chatbox chatID={currentChat} />}
        </section>
    )
}
