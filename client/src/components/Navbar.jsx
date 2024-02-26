import React, { useState } from 'react'
import Dropdown from './Dropdown'
import Searchbar from './Searchbar'

export default function Navbar() {
    const [location, setLocation] = useState('Toronto, ON');
    const [range, setRange] = useState('60KM');

    return (
        <nav className=" bg-slate-900 h-[8vh] w-full">
            <div className="container mx-auto flex justify-between space-x-4 items-center py-[1vh] ">
                <section className='flex w-[80%] shrink-0'>
                    <section id="nav-logo" className="w-[25%] h-[6vh] flex justify-center items-center">
                        <img src="./assets/logo.png" alt="logo" className="h-full w-auto"></img>
                    </section>
                    <section id="nav-search-group" className="w-auto flex ml-20 space-x-4 items-center justify-start">
                        <Searchbar/>
                        <section className='text-white flex justify-start items-center space-x-2'>
                            <h2 className=' overflow-hidden text-nowrap'>{location} - {range}</h2>
                        </section>
                    </section>
                </section>
                <section id="nav-account" className="flex justify-center items-center space-x-2 float-end">
                    <div id="nav-account-header"></div>
                    <Dropdown></Dropdown>
                </section>
            </div>
        </nav>
    )
}
