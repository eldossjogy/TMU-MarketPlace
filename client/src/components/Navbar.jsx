import React, { useState, useEffect, useContext } from 'react'
import Dropdown from './Dropdown'
import Searchbar from './Searchbar'
import AuthContext from '../authAndContext/contextApi';
import LocationContext from '../authAndContext/locationProvider';
import { MapPinIcon } from '@heroicons/react/24/solid';
import ProfilePicture from './ProfilePicture';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png"

export default function Navbar() {
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const {city, range, getLocation} = useContext(LocationContext);
    const { user, checkIfAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDropdownOptions = async () => {
            // Perform asynchronous operation to determine authentication status
            const isAdmin = await checkIfAdmin();
    
            const unauthOptions = [{name: 'Log in', url: '/login'}, {name: 'Register', url: '/register'}];
            const authOptions = isAdmin
                ? [
                    {name: 'Post New Ad', url: '/my-market/create-listing'},
                    {name: 'My Market', url: '/my-market'},
                    {name: 'My Profile', url: '/my-market/profile'},
                    {name: 'Inbox', url: '/my-market/inbox'},
                    {name: 'Saved Listings', url: '/my-market/saved'},
                    { name: 'Admin Dashboard', url: '/admin-dashboard'},
                    { name: 'Log out', url: '/logout' },
                  ]
                : [
                    {name: 'Post New Ad', url: '/my-market/create-listing'},
                    {name: 'My Profile', url: '/my-market'},
                    {name: 'Profile', url: '/my-market/profile'},
                    {name: 'Inbox', url: '/my-market/inbox'},
                    {name: 'Saved Listings', url: '/my-market/saved'},
                    { name: 'Log out', url: '/logout' },
                  ];
    
            const dropdownOptions = !user ? unauthOptions : authOptions;
            setDropdownOptions(dropdownOptions);
        };
    
        fetchDropdownOptions();
      }, [user]);
    
    return (
        <nav className=" bg-slate-900 h-auto md:h-16 w-full flex">
            <div className="container mx-auto flex flex-col justify-center p-4 md:flex-row md:justify-between md:items-center md:h-full md:p-0 md:py-1 md:pr-[3vw] lg:max-w-[90%]">
                <section className='md:flex md:flex-row md:w-auto space-y-4 md:space-y-0'>
                    <section className='flex w-full items-center justify-between flex-wrap md:block md:w-auto'>
                        <Link to={'/'}>
                            <section id="nav-logo" className="w-auto h-12 flex justify-start items-center shrink-0 cursor-pointer md:w-64 xl:w-80 md:mx-3 md:me-6">
                                <img src={Logo} alt="logo" className="h-full w-auto md:m-auto"></img>
                            </section>
                        </Link>
                        <section id="nav-account-mobile" className="flex md:hidden space-x-2">
                            <Dropdown options={dropdownOptions} text={user ? '' : 'Log In'} image={<ProfilePicture/>}/>
                        </section>
                    </section>
                    <section id="nav-search-group" className="flex flex-wrap space-y-2 group md:flex-nowrap md:space-y-0 md:w-[30vw] md:space-x-2 md:items-center md:justify-start">
                        <Searchbar location={city}/>
                        <section className='hidden md:flex space-x-1 text-white text-sm items-center hover:text-red-400' onClick={() => {getLocation();}}>
                            <MapPinIcon className='h-6 w-6 shrink-0'/>
                            <span className='whitespace-nowrap'>{range/1000}km range</span>
                        </section>
                        <section className='md:hidden text-white flex items-center justify-center overflow-hidden space-x-2 hover:text-red-400' onClick={() => {getLocation()}}>
                            <MapPinIcon className='h-6 w-6'/>
                            <span className='whitespace-nowrap'>{(city === '' ? '' : ` ${city} - `)}{range/1000}km range</span>
                        </section>
                    </section>
                </section>
                <section id="nav-account" className="hidden md:flex justify-center items-center shrink-0">
                    <Dropdown options={dropdownOptions} text={user ? user.name ?? 'User' : 'Log In'} image={<ProfilePicture/>}/>
                </section>
            </div>
        </nav>
    )
}