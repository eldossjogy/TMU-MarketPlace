import React, { useState } from 'react'

export default function Dropdown() {
    const [show, setShow] = useState(false);

    let options = ['Your Market','Your Profile','Your Inbox','Saved Listings','Log out']


    if(show) {
        return (
            <div className="relative inline-block text-left">
                <button type="button" className="flex text-lg text-white space-x-2" id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={() => {setShow(!show)}}>
                    <span className='min-w-fit'>Log In</span>
                    <img src="./assets/avatars/12345.jpg" className="h-7 w-7 rounded-full sm:mx-0 sm:shrink-0 ring-2 ring-orange-600/60 shadow-lg" alt='profile picture'></img>
                </button>
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-300" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
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
            <div className="relative inline-block text-left">
                <button type="button" className="flex text-lg text-white space-x-2" id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={() => {setShow(true)}}>
                    <span>Log In</span>
                    <img src="./assets/avatars/12345.jpg" className="h-7 w-7 rounded-full sm:mx-0 sm:shrink-0 ring-2 ring-orange-600/60 shadow-lg" alt='profile picture'></img>
                </button>
            </div>
        )
    }
}

function DropdownOption({index, content, count}) {

    let roundedStyle = index == count - 1 ? 'rounded-b-md' : 'rounded-t-md';

    return(
        <a href="#" className={"text-gray-700 block px-4 py-2 text-sm hover:bg-neutral-200 " + roundedStyle} role="menuitem" tabIndex="-1" id="menu-item-0">{content ?? ''}</a>
    )
}

function DropDownSection({children}) {
    return (
        <div className="" role="none">
            {children}
        </div>
    )
}