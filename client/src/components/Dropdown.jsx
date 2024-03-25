import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export default function Dropdown({options, text = 'Log In', image = <ProfilePicture/>}) {
    const [show, setShow] = useState(false);

    if(show) {
        return (
            <div className="relative inline-block text-left justify-end">
                <button type="button" className="flex text-lg text-white space-x-2 items-center w-auto" aria-expanded="true" aria-haspopup="true" onClick={() => {setShow(!show)}}>
                    <span className='pl-2 truncate shrink'>{text}</span>
                    {image}
                    <ChevronDownIcon className='w-8 h-8 md:w-7 md:h-7 ml-1 shrink-0'/>
                </button>
                <div className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-300" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <DropDownSection>
                        {options.map((element, index) => {
                            return (<DropdownOption key={index} index={index} content={element} count={options.length}/>);
                        })}
                    </DropDownSection>
                </div>
            </div>
        )
    }
    else{
        return (
            <div className="relative inline-block text-left justify-start">
                <button type="button" className="flex text-lg text-white space-x-2 items-center w-auto" aria-expanded="true" aria-haspopup="true" onClick={() => {setShow(true)}}>
                    <span className='pl-2 truncate'>{text}</span>
                    {image}
                    <ChevronDownIcon className='w-8 h-8 md:w-7 md:h-7 ml-1 shrink-0'/>
                </button>
            </div>
        )
    }
}

function DropdownOption({index, content, count}) {
    let roundedStyle = index === count - 1 ? 'rounded-b-md border-gray-300 border-t-2' : '';

    return(
        <span className={`${index == 0 ? 'rounded-t-md font-bold text-neutral-900 hover:bg-[#F9B300] border-[#F9B300] border-b-2' : 'text-gray-700 hover:bg-neutral-200'} block px-4 py-2 text-sm  ` + roundedStyle} role="menuitem" tabIndex="-1" id="menu-item-0">
            <Link to={content.url ?? '/'} className='flex w-full h-full'>{content.name ?? ''}</Link>
        </span>
    )
}

function DropDownSection({children}) {
    return (
        <div className=" rounded-md shadow-md" role="navigation">
            {children}
        </div>
    )
}