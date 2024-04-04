import React, { useContext, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatContext from "../authAndContext/chatProvider";
import AuthContext from '../authAndContext/contextApi';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function Chatbox({chatData}) {
    const { sentMsg, getChat, messages, currentChat, exitChat } = useContext(ChatContext)
    const { user } = useContext(AuthContext)
    const [nextMessage, setNextMessage] = useState('');

    useEffect(() => { getChat() }, [user])
    /* call on unmount */
    useEffect(() => {
        return () => {
        exitChat()
        };
    }, []); // Empty dependency array means this effect runs only once (on mount) and cleans up on unmount

    const sendMessage = (e) => {
        e?.preventDefault();

        if(currentChat !== null) {
            setNextMessage('');
            sentMsg(currentChat, nextMessage).then(() => {
                let container = document.querySelector('#message-container');
                container.scroll({
                    top: container.scrollHeight,
                    left: 0,
                    behavior: "smooth"
                })
            });
        }
    }
    
    return (
        <div className='flex flex-col group w-full lg:w-1/2 2xl:w-[40%] rounded-xl  border-2 border-gray shadow-md hover:shadow-lg h-[60vh] divide-y-2 overflow-hidden'>
            <section className='w-full p-3 h-24 bg-[#fafafb] rounded-xl'>
                <div className='flex justify-between'>
                <h1 className='text-4xl'>{chatData?.title}</h1>
                <button onClick={() => exitChat()} className="rounded-md shadow-md bg-rose-500 text-white flex justify-center items-center p-1">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                </div>
                <h3 className='text-xl'>{chatData?.username}</h3>
            </section>
            <section className='flex w-full bg-white p-3 overflow-y-auto overflow-x-hidden h-[80%] flex-col-reverse' id='message-container'>
                {messages && messages.filter((ele) => {return ele.chat_id === currentChat ? true : false}).reverse().map((msg) => (
                    <ChatMessage key={msg.id} message={msg.message} sender={msg.sender_id === user.id} username={msg.sender.name} timestamp={msg.created_at}/>
                    ))
                }
            </section>
            <form className='w-full bg-white p-3 h-auto shrink-0 flex justify-center items-center flex-row-reverse z-50 gap-2 rounded-xl' onSubmit={sendMessage}>
                <button className="w-full rounded-xl shadow-md h-full bg-[#eebe45] hover:bg-[#f9a200] text-neutral-950 flex justify-center items-center py-1 max-w-20">Send</button>
                <input className='w-full bg-neutral-100 rounded-2xl border-gray-200' placeholder='Send a message' name='message' aria-label='message' value={nextMessage} onChange={(e) => { setNextMessage(e.target.value); }}></input>
            </form>
        </div>
    )
}
