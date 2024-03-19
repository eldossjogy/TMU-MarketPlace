import React, {useContext, useState} from "react";
import { MapContainer, TileLayer} from 'react-leaflet'
import LocationContext from '../authAndContext/locationProvider';
import LocateControl from "./LeafletLocateControl";
import LocationMarker from "./LocationMarker";
import toast from "react-hot-toast";

export default function LocationPicker(applyFn) {
    const {location, city, range, setRange, generateLocation, searchForLocation} = useContext(LocationContext);
    const [locationQuery, setLocationQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const handleLocationSearch = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const query = form.get('location');
        const results = await searchForLocation(query); // Search for a map location given a user query
        
        if(results[0]){ // If there are results, use the first one
            setLocationQuery(results[0].name) // Update the query text to be the result
            setNoResults(false);
            generateLocation({lat: results[0].lat, lng: results[0].lng}); // Set user location to search result
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
                <input className={`w-full rounded-md ring-red-600 ring-opacity-30 ${noResults ? 'ring-2 border-red-600 focus:ring-red-400 focus:border-red-600' : ''}`} name="location" type="text" placeholder={city} value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); }}></input>
                <label className="w-full text-sm" htmlFor="range">Search Radius</label>
                <select className="w-full rounded-md" name="range" onChange={(e) => {
                    setRange(e.target.value ?? 1000)
                }}>
                    <option value={5000}>5 km</option>
                    <option value={10000}>10 km</option>
                    <option value={15000}>15 km</option>
                    <option value={30000}>30 km</option>
                    <option value={50000}>50 km</option>
                    <option value={100000}>100 km</option>
                </select>
            </form>
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
            <div className="flex justify-end space-x-2">
                <button className="py-2 px-4 rounded-lg hover:bg-sky-600 bg-sky-500 text-white" onClick={() => {//bg-[#F9B300]
                    applyFn.applyFn(location.lat, location.lng, range); // Use generated location and range for feature specified in props (such as updating search results or changing user location)
                }}>
                    Apply Location
                </button>
            </div>
        </>
    );
}