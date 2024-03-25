import React, {useContext, useState} from "react";
import { MapContainer, TileLayer} from 'react-leaflet'
import LocationContext from '../authAndContext/locationProvider';
import LocateControl from "./LeafletLocateControl";
import LocationMarker from "./LocationMarker";
import toast from "react-hot-toast";

export default function LocationPicker({applyFn = (a,b,c) => {}, useMap = true}) {
    const {location, city, range, setRange, generateLocation, searchForLocation, searchingLocation} = useContext(LocationContext);
    const [locationQuery, setLocationQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const handleLocationSearch = async (e) => {
        e.preventDefault();
        toast("Searching for Location")

        const form = new FormData(e.target);
        const query = form.get('location');
        const results = await searchForLocation(query); // Search for a map location given a user query
        
        if(results){ // If there are results
            setLocationQuery(results.name) // Update the query text to be the result
            setNoResults(false);
            generateLocation({lat: results.lat, lng: results.lng}); // Set user location to search result
        }
        else{ // No search results for user location query
            toast.error("No location results.")
            setNoResults(true);
        }
    };

    return (
        <>
            <form className="flex-col justify-center" onSubmit={handleLocationSearch}>
                <label className="w-full text-sm" htmlFor="location">Location</label>
                <input 
                    className={`w-full rounded-md ring-red-600 ring-opacity-30 ${noResults ? 'ring-2 border-red-600 focus:ring-red-400 focus:border-red-600' : searchingLocation ? 'ring-2 border-amber-500 focus:ring-amber-400 focus:border-amber-600' : ''}`} 
                    name="location" type="text" placeholder={city} value={locationQuery} 
                    onChange={(e) => { setLocationQuery(e.target.value); }}
                    disabled={searchingLocation}
                ></input>
                <label className="w-full text-sm" htmlFor="range">Search Radius</label>
                <select className="w-full rounded-md" name="range" value={range} onChange={(e) => {
                    setRange(e.target.value ?? 1000)
                }}>
                    <option aria-label="Set range to 5 kilometers" value={5000}>5 km</option>
                    <option aria-label="Set range to 10 kilometers" value={10000}>10 km</option>
                    <option aria-label="Set range to 15 kilometers" value={15000}>15 km</option>
                    <option aria-label="Set range to 30 kilometers" value={30000}>30 km</option>
                    <option aria-label="Set range to 50 kilometers" value={50000}>50 km</option>
                    <option aria-label="Set range to 100 kilometers" value={100000}>100 km</option>
                </select>
            </form>
            {useMap && (
            <div className="aspect-video rounded-xl overflow-hidden ring-2 ring-neutral-400" id="map">
                <MapContainer center={[location.lat, location.lng]} zoom={10} scrollWheelZoom={true} className="h-full" doubleClickZoom={false} attributionControl={false} zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocateControl/>
                    <LocationMarker/>
                </MapContainer>
            </div>   
            )}
            <div className="flex justify-end space-x-2">
                <button className="py-2 px-4 rounded-lg hover:bg-sky-600 bg-sky-500 text-white" onClick={() => {//bg-[#F9B300]
                    applyFn(location.lat, location.lng, range); // Use generated location and range for feature specified in props (such as updating search results or changing user location)
                }}>
                    Apply Location
                </button>

                {/* <button className="py-2 px-4 rounded-lg hover:bg-sky-500 ring-sky-500 ring-2 text-neutral-900 hover:text-white" onClick={() => {//bg-[#F9B300]
                    applyFn(location.lat, location.lng, range); // Use generated location and range for feature specified in props (such as updating search results or changing user location)
                }}>
                    Apply Location
                </button> */}
            </div>
        </>
    );
}