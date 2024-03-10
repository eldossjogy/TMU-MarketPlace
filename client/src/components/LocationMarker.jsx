import React, {useState, useContext, useEffect} from "react";
import {useMap, useMapEvents, Popup, Marker, Circle} from 'react-leaflet'
import LocationContext from '../authAndContext/locationProvider';
import L from "leaflet";

export default function LocationMarker() {
    const {location, generateLocation, range} = useContext(LocationContext);
    const [map, setMap] = useState(useMap());
    const [circle, setCircle] = useState(L.circle({lat: location.lat, lng: location.lng}, range));

    const mapEvents = useMapEvents({
        dblclick(e) {
            generateLocation({lat: e.latlng.lat, lng: e.latlng.lng}).then(()=>{
                // map.flyTo(e.latlng, 10); 
                //let circle = L.circle(e.latlng, range).addTo(map);
                //map.fitBounds(circle.getBounds());
                //map.removeLayer(circle);
            });
        }
    })




    useEffect(() => {
        console.log('CIRCLE');
        circle.addTo(map)
    }, [circle]);

    useEffect(() => {
        map.flyTo({lat: location.lat, lng: location.lng}, 10); 
        circle.setRadius(range);
        circle.setLatLng({lat: location.lat, lng: location.lng});
        map.fitBounds(circle.getBounds());
    }, [location, range]);

    return location === null ? null : (
        
        // <Circle
        //     center={{lat: location.lat, lng: location.lng}}
        //     radius={range}
        //     className=" stroke-neutral-500 fill-slate-700 stroke-1"
        // >
            
        // </Circle>

        <Marker position={{lat: location.lat, lng: location.lng}}>
            <Popup>{`Your Location`}</Popup>
        </Marker>
    )
}
