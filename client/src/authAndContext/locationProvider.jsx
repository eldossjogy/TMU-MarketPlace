import React, { useState, useEffect, createContext } from 'react';
import toast from 'react-hot-toast';

const LocationContext = createContext();

export const LocationProvider = ({ children }) =>  {
    const [isReady, setIsReady] = useState(false);
    const [searchingLocation, setsearchingLocation] = useState(false);
    const [location, setLocation] = useState({lat: 43.65775180503111, lng:-79.3786619239608});
    const [city, setCity] = useState("Toronto, ON");
    const [range, setRange] = useState(30000);

    useEffect(() => {
        loadLocation();
        //setIsReady(true);
    }, []);

    async function loadLocation() {
        // TODO load localstorage location
    }

    // Gets IP address location from browser and forwards it to generateLocation(pos)
    async function getLocation() {
        if (!navigator.geolocation) {
            toast.promise(generateLocation({lat: 43.65775180503111, lng:-79.3786619239608}), {loading: 'Setting default location...', success: 'Geolocation is not supported by this browser. Set to default.', error: 'Geolocation is not supported by this browser. Could not set default location.'})
            return;
        }

        navigator.permissions.query({ name: "geolocation" }).then(function (result) {
            if (result.state === "denied") {
                //If denied then you have to show instructions to enable location
                toast.promise(generateLocation({lat: 43.65775180503111, lng:-79.3786619239608}), {loading: 'Setting default location...', success: 'You did not allow location access. Set to default.', error: 'You did not allow location access. Could not set default location.'})
                toast("To use your location, allow access from your browser.", {icon: "ℹ"})
            } else{
                //If prompt then the user will be asked to give permission or location was already granted 
                navigator.geolocation.getCurrentPosition(
                    (pos) => { toast.promise(generateLocation({lat: pos.coords.latitude, lng: pos.coords.longitude}), {loading: 'Setting location...', success: 'Set location!', error: 'Could not set location.'})},
                    () => { toast.error(`Cannot get your location.`); }, 
                    {enableHighAccuracy: true, timeout: 5000, maximumAge: 65255}
                );
            }
        });
    } 

    // Generates user location and user city from latitude and longitude {lat: number, lng: number}
    async function generateLocation(pos, updateCity = true) {
        let result;
        if((pos?.lat ?? null) === null  || (pos?.lng ?? null) === null){
            console.log(`Invalid coordinates provided to generate location`);
            return Promise.reject(new Error('error'));
        }

        setLocation(pos);
        const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=";
        result = fetch(GEOCODE_URL+`${pos.lng},${pos.lat}`).then(res => res.json()).then(res => {
            if(updateCity) setCity(`${res.address.City !== '' ? `${res.address.City},` : ''}${(res.address.RegionAbbr !== '' ? ' ' + res.address.RegionAbbr : 'Middle of nowhere ??')} `);
            return res.address;
        });

        setIsReady(true);
        return result;
    }

    // 
    /**
     * This generates user location (latitude and longitude) and city (city and region) from location name (user input)
     *
     * @param {string} query - A string param
     * @param {object} [options] - A optional object with a postalCode option that indicates the query is a postal code
     * @returns {object} result - An object containing the "name", "lat" coordinate and "lng" coordinate of the search result. On error
     * @returns {null} null - On Error
     *
     * @example
     *
     *      searchForLocation('toronto')
     *      searchForLocation('M1G3S6', {postalCode: true})
     */
    async function searchForLocation(query, options = {postalCode: false, getAddress: false}) {
        setsearchingLocation(true);

        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1&countrycodes=ca`);
        const results = await response.json();
        
        let res;

        if(results[0]){
            let locationResult = results[0]

            if(options.getAddress){
                const address = await generateLocation({lat: locationResult['lat'], lng: locationResult['lon']})

                if(!address){
                    res = null;
                }
                else{
                    res = {name: locationResult['display_name'], lat: locationResult['lat'], lng: locationResult['lon'], address: address}
                }
            } 
            else{
                res = {name: locationResult['display_name'], lat: locationResult['lat'], lng: locationResult['lon']}
            }
        }
        setsearchingLocation(false);
        return res;
    }

    return (
        <LocationContext.Provider value={{location, city, range, searchingLocation, setRange, generateLocation, getLocation, searchForLocation}} >
            {children}
        </LocationContext.Provider>
    )
}

export default LocationContext
