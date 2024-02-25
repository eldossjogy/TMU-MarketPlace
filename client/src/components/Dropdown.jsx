import React, { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BeakerIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



export default function Dropdown() {
    const [show, setShow] = useState(true);

    return (
        <div class="relative inline-block text-left">
            <button type="button" class="flex text-lg text-white space-x-2" id="menu-button" aria-expanded="true" aria-haspopup="true">
                <span>Log In</span>
                <img src="./assets/avatars/12345.jpg" class="h-7 w-7 rounded-full sm:mx-0 sm:shrink-0 ring-2 ring-orange-600/60 shadow-lg" alt='profile picture'></img>
                {/* <ChevronDownIcon /> */}
            </button>
            <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div class="py-1" role="none">
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Account settings</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Support</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2">License</a>
                <form method="POST" action="#" role="none">
                    <button type="submit" class="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Sign out</button>
                </form>
                </div>
            </div>
        </div>
    )
}
