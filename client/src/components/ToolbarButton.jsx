import { BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/solid'
import React from 'react'

export default function ToolbarButton({stateID, value, checked, onClick, stateValue = 0, baseStyle = 'px-4 py-1 my-1 me-2 text-sm', useIcon = true}) {


    return (
        <>
            <button className={`flex items-center justify-center ring-2 ring-inset rounded-2xl space-x-1 ${baseStyle} ${checked ? 'ring-yellow-500 hover:bg-yellow-400 bg-amber-400' : 'ring-sky-600 hover:text-white hover:bg-sky-500'}`} onClick={() => {
                    onClick(stateID)
                }}>
                <span>{value}</span>
                {useIcon && stateValue === 1 ? <BarsArrowDownIcon className='w-4 h-4'/> : stateValue === 2 ? <BarsArrowUpIcon className='w-4 h-4'/> : ''}
            </button>
        </>
    )
}
