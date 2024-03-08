import React, {useState, useContext} from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Popup, Marker} from 'react-leaflet'
import LocationContext from '../authAndContext/locationProvider';

export default function LocationPicker() {
    const {location, generateLocation} = useContext(LocationContext);

    function LocationMarker() {
        const {location} = useContext(LocationContext);
        const map = useMapEvents({
            click(e) {
                console.log(location);
                console.log(e.latlng);
                generateLocation({lat: e.latlng.lat, lng: e.latlng.lng}).then(() => { map.flyTo(e.latlng, map.getZoom()); });
               
            }
        })

        return location === null ? null : (
            <Marker position={{lat: location?.lat ?? 43.65775180503111, lng: location?.lng ?? -79.3786619239608}}>
                <Popup>{`Your Location`}</Popup>
            </Marker>
        )
    }

    return (
        <MapContainer center={[location?.lat ?? 43.65775180503111, location?.lng ?? -79.3786619239608]} zoom={13} scrollWheelZoom={false} className="h-full">
            <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
              <button>Hi</button>
        </MapContainer>
    );
}