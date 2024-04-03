import React, { useState } from 'react'
import ChatMessage from './ChatMessage';

export default function Chatbox() {
    const [messages, setMessages] = useState([]);
    const [nextMessage, setNextMessage] = useState('');
    const sendMessage = (e) => {
        e?.preventDefault();

        if(nextMessage) {
            let time = new Date().toJSON();
            setMessages([...messages, {id: messages.length, message: nextMessage, initial: 'A', sender: true, timestamp: time}]);
            setNextMessage('');
        }
    }
    return (
        <div className='flex flex-col group w-full lg:w-[40%] rounded-xl  border-2 border-gray shadow-md hover:shadow-lg h-[60vh] divide-y-2 overflow-hidden'>
            <section className='w-full p-3 h-24 bg-[#fafafb] rounded-xl'>
                <h1 className='text-4xl'>Mazda RX-7</h1>
                <h3 className='text-xl'>Adam</h3>
            </section>
            <section className='flex flex-col w-full bg-white p-3 overflow-y-auto overflow-x-hidden h-[80%]'>
                {messages && messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg.message} sender={msg.sender} initial={msg.initial} timestamp={msg.timestamp}/>
                ))}
            </section>
            <form className='w-full bg-white p-3 h-auto shrink-0 flex justify-center items-center flex-row-reverse z-50 gap-2 rounded-xl' onSubmit={sendMessage}>
                <button className="w-full rounded-xl shadow-md h-full bg-[#eebe45] hover:bg-[#f9a200] text-neutral-950 flex justify-center items-center py-1 max-w-20">Reply</button>
                <input className='w-full bg-neutral-100 rounded-2xl border-gray-200' placeholder='Send a message' name='message' aria-label='message' value={nextMessage} onChange={(e) => {setNextMessage(e.target.value);}}></input>
            </form>
        </div>
    )
}
