import React, {useState, useContext, useEffect} from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Popup, Marker, Circle} from 'react-leaflet'
import LocationContext from '../authAndContext/locationProvider';
import LocateControl from "./LeafletLocateControl";

export default function LocationPicker() {
    const {location, generateLocation} = useContext(LocationContext);
    const [position, setPosition] = useState({lat:43.65775180503111,lng:-79.3786619239608});

    function LocationMarker() {
        const {location, range} = useContext(LocationContext);
        const map = useMapEvents({
            click(e) {
                console.log(location);
                console.log(e.latlng);
                generateLocation({lat: e.latlng.lat, lng: e.latlng.lng}).then(() => { map.flyTo(e.latlng, map.getZoom()); });
            }
        })
        
        return location === null ? null : (
            
            <Circle
                center={{lat: location?.lat ?? 43.65775180503111, lng: location?.lng ?? -79.3786619239608}}
                radius={range}
            >
                <Marker position={{lat: location?.lat ?? 43.65775180503111, lng: location?.lng ?? -79.3786619239608}}>
                    <Popup>{`Your Location`}</Popup>
                </Marker>
            </Circle>
        )
    }

    useEffect(() => {
        console.log(location);
        setPosition(location);
    }, [])
    

    return (
        <MapContainer center={[position.lat, location?.lng ?? -79.3786619239608]} zoom={13} scrollWheelZoom={true} className="h-full">
            <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocateControl />
              <LocationMarker />
        </MapContainer>
    );
}