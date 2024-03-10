import React, { useState, useEffect, createContext } from 'react';
import toast from 'react-hot-toast';

const LocationContext = createContext();

export const LocationProvider = ({ children }) =>  {
    const [isReady, setIsReady] = useState(false);
    const [location, setLocation] = useState({lat:0,lng:0});
    const [city, setCity] = useState("");
    const [range, setRange] = useState(5000);

    useEffect(() => {
        getLocation();
    }, []);

    // Gets IP address location from browser and forwards it to generateLocation(pos)
    async function getLocation() {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by this browser.");
            generateLocation({lat: 43.65775180503111, lng:-79.3786619239608});
            return;
        }

        navigator.permissions.query({ name: "geolocation" }).then(function (result) {
            if (result.state === "denied") {
                //If denied then you have to show instructions to enable location
                toast.error(`You did not allow location access.`);
                generateLocation({lat: 43.65775180503111, lng:-79.3786619239608})
            } else{
                //If prompt then the user will be asked to give permission or location was already granted 
                navigator.geolocation.getCurrentPosition(
                    (pos) => { generateLocation({lat: pos.coords.latitude, lng: pos.coords.longitude})},
                    () => { toast.error(`Cannot get your location.`); }, 
                    {enableHighAccuracy: true, timeout: 5000, maximumAge: 65255}
                );
            }
        });
    } 

    // Generates user location and user city from latitude and longitude {lat: number, lng: number}
    async function generateLocation(pos) {
        if((pos?.lat ?? null) === null  || (pos?.lng ?? null) === null){
            console.log(`Invalid coordinates provided to generate location`);
            return;
        }

        setLocation(pos);
        const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=";
        fetch(GEOCODE_URL+`${pos.lng},${pos.lat}`).then(res => res.json()).then(res => {
            setCity(`${res.address.City !== '' ? `${res.address.City},` : ''}${(res.address.RegionAbbr !== '' ? ' ' + res.address.RegionAbbr : 'Middle of nowhere ??')} `);
        });

        setIsReady(true);
    }

    // Generates user location (latitude and longitude) and city (city and region) from location name (user input)
    //function generateCoordinates(loc) {
        //TODO
    //}

    return (
        <LocationContext.Provider value={{location, city, range, setRange, generateLocation, getLocation}} >
            {isReady ? children : null}
        </LocationContext.Provider>
    )
}

export default LocationContext
