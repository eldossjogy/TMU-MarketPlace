import React from 'react'

export default function ChatMessage(
    { sender = true, message = '', username = 'A', timestamp = '' }) {


    const rawDate = new Date(timestamp ?? '01/16/2024');
    const rawAge = Date.now() - rawDate.getTime();

    const weeks = Math.round(rawAge / (1000 * 3600 * 24 * 7));
    const days = Math.round(rawAge / (1000 * 3600 * 24));
    const hours = Math.round(rawAge / (1000 * 3600));
    const minutes = Math.round(rawAge / (1000 * 60));
    const seconds = Math.round(rawAge / (1000));

    const age = weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : days > 0 ? `${days} day${days > 1 ? 's' : ''} ago` : hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ago` : minutes > 0 ? `${minutes}m ago` : `${seconds}s ago`

    return (
        <>
            {!sender && (
                <div className='flex p-1 max-w-full'>
                    <div className='flex-col space-y-2' >
                        <div className='flex gap-2'>
                            <div className='flex items-center justify-center rounded-full h-8 w-8 aspect-square bg-rose-500'>{username[0]}</div>
                            <div className='flex items-center justify-start text-gray-400 line-clamp-1 truncate'>{age}</div>
                        </div>
                        <div className='bg-neutral-200 rounded-xl flex items-center justify-start p-2 w-auto'>{message}</div>
                    </div>
                    <div className='w-[30%] shrink-0'>
                    </div>
                </div>
            )}
            {sender && (
                <div className='flex p-1 flex-row-reverse max-w-full'>
                    <div className='flex-col space-y-2 w-full' >
                        <div className='flex gap-2 flex-row-reverse'>
                            <div className='flex items-center justify-center rounded-full h-8 w-8 aspect-square bg-violet-400'>{username[0]}</div>
                            <div className='flex items-center justify-start text-gray-400 line-clamp-1 truncate'>{age}</div>
                        </div>
                        <div className='bg-sky-200 rounded-xl flex items-center justify-start p-2 w-auto'>{message}</div>
                    </div>
                    <div className='w-[30%] shrink-0'>
                    </div>
                </div>
            )}
        </>
    )
}
