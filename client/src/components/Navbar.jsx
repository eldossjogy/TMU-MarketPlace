import React, { useState, useEffect } from 'react'
import Dropdown from './Dropdown'
import Searchbar from './Searchbar'

export default function Navbar() {
    const [location, setLocation] = useState('Toronto, ON');
    const [range, setRange] = useState('60KM');

    function success(pos) {
        var crd = pos.coords;
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
    
        //getLocationInfo(crd.latitude, crd.longitude);
        setLocation(`${crd.latitude} ${crd.longitude}`)

        const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=";
        fetch(GEOCODE_URL+`${crd.longitude},${crd.latitude}`).then(res => res.json()).then(res => {
            console.log(res.address);
            setLocation(`${res.address.City}, ${res.address.RegionAbbr}`);
            setRange(`${crd.accuracy} m`)
        });
        // fetch(`https://nominatim.openstreetmap.org/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json`).then(res => res.json()).then(res => {
        //     console.log(res);
        //     console.log(crd);
        //     setLocation(`${res.address.city}`);
        //     setRange(`${crd.accuracy} m`)
        // })
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
                console.log(result);
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
      }, []);
    
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
