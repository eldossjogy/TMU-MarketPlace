import { TrashIcon } from '@heroicons/react/24/solid';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import CardImages from './CardImages';
import ChatContext from '../authAndContext/chatProvider';

export default function HorizontalCardInbox({
    image,
	ad_id,
	title,
	username,
    lastMessage,
	date,
    chat_id,
    unread,
    data,
    setCurrentData
}) {
    const {removeNotification} = useContext(ChatContext)

	const [hovered, setHovered] = useState(false);
	const rawDate = new Date(date ?? '01/16/2024');
	const rawAge = Date.now() - rawDate.getTime();

	const weeks = Math.round(rawAge / (1000 * 3600 * 24 * 7));
	const days = Math.round(rawAge / (1000 * 3600 * 24));
	const hours = Math.round(rawAge / (1000 * 3600));
	const minutes = Math.round(rawAge / (1000 * 60));
	const seconds = Math.round(rawAge / (1000));
    
	const age = weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : days > 0 ? `${days} day${days > 1 ? 's' : ''} ago` : hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ago` : minutes > 0 ? `${minutes}m ago` : `${seconds}s ago`

    const handleSetChat = () => {
        removeNotification(chat_id);
        setCurrentData((prev)=>({...prev, ...data}))
    }
    return (

        <div className="hover:cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg p-3 space-x-3 flex group max-h-48 lg:max-h-64 2xl:max-h-80 overflow-hidden">
                <section className="flex flex-col items-center justify-center my-auto max-w-32 lg:max-w-56 2xl:max-w-72 space-y-2 h-full  rounded-md bg-[#fafafb] ">
                    <CardImages image={image} hovered={hovered} setHovered={setHovered} vertical={false} />
                    
                    <Link to={{ pathname: `/ad/${ad_id}` }} className='w-full'>
                        <button className="w-full rounded-md shadow-md bg-[#181818] hover:bg-[#2b2b2b] text-white flex justify-center items-center py-1">View Ad</button>
                    </Link>
                </section>
                    
                <section className="w-full flex flex-row-reverse shr">
                    <section className="flex flex-col justify-between text-right min-w-24 md:w-32 items-end md:shrink-0">
                        <div className="overflow-hidden">
                            <h2 className="font-bold text-xs sm:text-sm md:text-lg line-clamp-1">{String(age)}</h2>
                            <h2 className="text-rose-700 font-bold text-xs md:text-base line-clamp-1">{ unread ? 'Unread' : ''}</h2>
                        </div>
                        <div className='w-full flex space-x-2'>
                            {/* <button className="rounded-md shadow-md bg-rose-500 hover:bg-rose-600 text-white hidden group-hover:flex justify-center items-center p-1"><TrashIcon className='h-6 w-6'/></button> */}
                            <button className="ml-auto w-full rounded-md shadow-md bg-[#F9B300] hover:bg-[#f9a200] text-neutral-950 hidden group-hover:flex justify-center items-center py-1 max-w-20" onClick={handleSetChat}>Reply</button>
                        </div>
                    </section>
                    <section className="flex flex-col justify-between w-full">
                        <div>
                            <div className="flex justify-between pb-2">
                                <p className="line-clamp-1 font-bold text-xl">{username}</p>
                            </div>
                            <div className="sm:min-h-16">
                                <p className="line-clamp-1 sm:line-clamp-2 xl:line-clamp-4">{lastMessage}</p>
                            </div>
                        </div>
                        <div className="block sm:flex sm:flex-nowrap sm:space-x-4">
                            <div className="h-auto line-clamp-1 font-bold max-w-72 lg:text-xl">{title}</div>
                        </div>
                    </section>
                </section>
                
            </div>
        </div>
    )
}
