import React from 'react'
import Dropdown from './Dropdown'

export default function Navbar() {
  return (
    <nav className=" bg-slate-900 h-[8vh]">
            <div className="container mx-auto flex px-4 justify-between items-center">
                <div id="logo" className="h-[6vh]">
                    <img src="./assets/logo.png" alt="logo" className="h-full w-auto"></img>
                </div>
                <div id="search" className="w-auto flex space-x-4 items-center justify-center">
                    <input
                    className="rounded-xl h-[4vh] w-[400px] text-center"
                        placeholder="123-45-678">
                    </input>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-[3vh] h-[3vh] stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </span>
                </div>
                <div id="account"></div>
                <Dropdown></Dropdown>
            </div>

        </nav>
    )
}
