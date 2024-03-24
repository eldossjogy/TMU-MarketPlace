import React from 'react'

export default function ChatMessage(
    {sender = true, message = '', initial = 'A', timestamp = ''}) {
  return (
    <>
        {!sender && (<div className='flex p-1'>
                <div className='flex-col space-y-2' >
                    <div className='flex gap-2'>
                        <div className='flex items-center justify-center rounded-full h-8 w-8 aspect-square bg-rose-500'>{initial}</div>
                        <div className='flex items-center justify-start text-gray-400 line-clamp-1 truncate'>{timestamp}</div>
                    </div>
                    <div className='bg-neutral-200 rounded-xl flex items-center justify-start p-2 w-auto'>{message}</div>
                </div>
                <div className='w-[30%] shrink-0'>
                </div>
            </div>
        )}
        {sender && (
            <div className='flex p-1 flex-row-reverse'>
                <div className='flex-col space-y-2 w-ful' >
                    <div className='flex gap-2 flex-row-reverse'>
                        <div className='flex items-center justify-center rounded-full h-8 w-8 aspect-square bg-violet-400'>{initial}</div>
                        <div className='flex items-center justify-start text-gray-400 line-clamp-1 truncate'>{timestamp}</div>
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
