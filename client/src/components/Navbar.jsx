import React, { useState, useEffect, useContext } from 'react'
import Dropdown from './Dropdown'
import Searchbar from './Searchbar'
import AuthContext from '../authAndContext/contextApi';
import LocationContext from '../authAndContext/locationProvider';
import { MapPinIcon } from '@heroicons/react/24/solid';
import ProfilePicture from './ProfilePicture';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png"

export default function Navbar() {
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const {city, range, getLocation} = useContext(LocationContext);
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const authOptions = [{name: 'Your Market', url: '/'},{name: 'Your Profile', url: '/settings'},{name: 'Your Inbox', url: '/'},{name: 'Saved Listings', url: '/'},{name: 'Log out', url: '/logout'}];
        const unauthOptions = [{name: 'Log in', url: '/login'}, {name: 'Register', url: '/register'}];

        if(!user){
            setDropdownOptions(unauthOptions);
        } else{
            setDropdownOptions(authOptions);
        }
      }, [user]);
    
    return (
        <nav className=" bg-slate-900 h-auto md:h-16 w-full flex">
            <div className="hidden md:flex justify-between items-center h-full py-1 pr-[3vw] container mx-auto lg:max-w-[90%]">
                <section className='flex w-auto '>
                    <section id="nav-logo" className="w-64 xl:w-80 mx-3 me-6 shrink-0 h-12 flex justify-start items-center cursor-pointer" onClick={() => {navigate('/');}}>
                        <img src={Logo} alt="logo" className="h-full w-auto m-auto"></img>
                    </section>
                    <section id="nav-search-group" className="flex md:w-[30vw] group space-x-2 items-center justify-start">
                        <Searchbar location={city}/>
                        <div className='flex space-x-1 text-white text-sm items-center hover:text-red-400' onClick={() => {getLocation()}}>
                            <MapPinIcon className='h-6 w-6 shrink-0'/>
                            <span className='whitespace-nowrap'>{range/1000}km range</span>
                        </div>
                    </section>
                </section>
                <section id="nav-account" className="flex justify-center items-center shrink-0">
                    <Dropdown options={dropdownOptions} text={user ? user.name ?? 'User' : 'Log In'} image={<ProfilePicture/>}/>
                </section>
            </div>
            <div className="container mx-auto flex flex-col md:hidden space-y-4 justify-center p-4">
                <section className='flex w-full items-center justify-between flex-wrap'>
                    <section id="nav-logo-mobile" className="w-auto h-12 flex justify-start items-center shrink-0 cursor-pointer" onClick={() => {navigate('/');}}>
                        <img src={Logo} alt="logo" className="h-full w-auto"></img>
                    </section>
                    <section id="nav-account-mobile" className="flex space-x-2">
                        <Dropdown options={dropdownOptions} text={user ? '' : 'Log In'} image={<ProfilePicture/>}/>
                    </section>
                </section>
                <section id="nav-search-group-mobile" className="flex flex-wrap space-y-2">
                    <Searchbar/>
                    <section className='text-white flex items-center justify-center overflow-hidden space-x-2 hover:text-red-400' onClick={() => {getLocation()}}>
                        <MapPinIcon className='h-6 w-6'/>
                        <span className='whitespace-nowrap'>{(city === '' ? '' : ` ${city} - `)}{range/1000}km range</span>
                    </section>
                </section>
            </div>
        </nav>
    )
}
