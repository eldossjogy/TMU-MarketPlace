import React, {useContext, useState} from "react";
import { MapContainer, TileLayer} from 'react-leaflet'
import LocationContext from '../authAndContext/locationProvider';
import LocateControl from "./LeafletLocateControl";
import LocationMarker from "./LocationMarker";
import toast from "react-hot-toast";

export default function LocationPicker() {
    const {location, city, setRange, generateLocation} = useContext(LocationContext);
    const [locationQuery, setLocationQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const handleLocationSearch = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const query = form.get('location');
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1&countrycodes=ca`);
        const results = await response.json();

        try {
            let locationResult = results[0]
            console.log(locationResult);
            setLocationQuery(locationResult['display_name'])
            setNoResults(false);
            generateLocation({lat: locationResult['lat'], lng: locationResult['lon']});
        } catch (error) {
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
                <button className="py-2 px-4 rounded-lg hover:bg-sky-600 bg-sky-500 text-white" onClick={(e) => {//bg-[#F9B300]
                    handleLocationSearch(e.target.value); 
                }}>
                    Apply Location
                </button>
            </div>
        </>
    );
}