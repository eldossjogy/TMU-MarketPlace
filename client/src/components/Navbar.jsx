import React, { useState, useEffect, useContext } from 'react'
import Dropdown from './Dropdown'
import Searchbar from './Searchbar'
import AuthContext from '../authAndContext/contextApi';
import { MapPinIcon } from '@heroicons/react/24/solid';
import ProfilePicture from './ProfilePicture';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [location, setLocation] = useState('Toronto, ON');
    const [range, setRange] = useState('60KM');
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const authOptions = [{name: 'Your Market', url: '/'},{name: 'Your Profile', url: '/settings'},{name: 'Your Inbox', url: '/'},{name: 'Saved Listings', url: '/'},{name: 'Log out', url: '/logout'}];
    const unauthOptions = [{name: 'Log in', url: '/login'}, {name: 'Register', url: '/register'}];

    function success(pos) {
        var crd = pos.coords;
        // console.log("Your current position is:");
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        // console.log(`More or less ${crd.accuracy} meters.`);
    
        setLocation(`${crd.latitude} ${crd.longitude}`)

        const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=";
        fetch(GEOCODE_URL+`${crd.longitude},${crd.latitude}`).then(res => res.json()).then(res => {
            //console.log(res.address);
            setLocation(`${res.address.City}, ${res.address.RegionAbbr}`);
            setRange(`${String(crd.accuracy).substring(0,4)} m`)
        });
    }

    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions
            .query({ name: "geolocation" })
            .then(function (result) {
                //console.log(result);
                if (result.state === "granted") {
                //If granted then you can directly call your function here
                navigator.geolocation.getCurrentPosition(success, errors, options);
                } else if (result.state === "prompt") {
                //If prompt then the user will be asked to give permission
                navigator.geolocation.getCurrentPosition(success, errors, options);
                } else if (result.state === "denied") {
                //If denied then you have to show instructions to enable location
                }
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

        if(!user){
            setDropdownOptions(unauthOptions);
        } else{
            setDropdownOptions(authOptions);
        }

        //console.log(user);
        //user ? console.log(user.user.email) : console.log('');;
      }, [user]);
    
    return (
        <nav className=" bg-slate-900 h-auto md:h-16 w-full">
            <div className="hidden md:flex justify-between items-center h-full py-1 pr-[3vw] container mx-auto">
                <section className='flex w-auto'>
                    <section id="nav-logo" className="w-[20vw] h-12 flex justify-start items-center cursor-pointer" onClick={() => {navigate('/');}}>
                        <img src="./assets/logo.png" alt="logo" className="h-full w-auto m-auto"></img>
                    </section>
                    <section id="nav-search-group" className="flex group space-x-2 items-center justify-start">
                        <Searchbar/>
                        <div className='flex space-x-1 text-white truncate text-sm items-center'>
                            <MapPinIcon className='h-6 w-6 shrink-0'/>
                            <span className='truncate'>{location}</span>
                            <span className='whitespace-nowrap'>- {range}</span>
                        </div>
                    </section>
                </section>
                <section id="nav-account" className="flex justify-center items-center shrink-0">
                    <Dropdown options={dropdownOptions} text={user ? user.email ?? 'User' : 'Log In'} image={<ProfilePicture/>}/>
                </section>
            </div>
            <div className="container mx-auto flex flex-col md:hidden space-y-4 justify-center p-4">
                <section className='flex w-full items-center justify-between flex-wrap'>
                    <section id="nav-logo-mobile" className="w-auto h-12 flex justify-start items-center shrink-0 cursor-pointer" onClick={() => {navigate('/');}}>
                        <img src="./assets/logo.png" alt="logo" className="h-full w-auto"></img>
                    </section>
                    <section id="nav-account-mobile" className="flex space-x-2">
                        <Dropdown options={dropdownOptions} text={user ? '' : 'Log In'} image={<ProfilePicture/>}/>
                    </section>
                </section>
                <section id="nav-search-group-mobile" className="flex flex-wrap space-y-2">
                    <Searchbar/>
                    <section className='text-white flex items-center justify-center space-x-2 overflow-hidden'>
                        <MapPinIcon className='h-6 w-6'/>
                        <span className='truncate'>{location}</span>
                        <span className='whitespace-nowrap'>- {range}</span>
                    </section>
                </section>
            </div>
        </nav>
    )
}
