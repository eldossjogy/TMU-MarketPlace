import React, {useState, useContext, useEffect} from "react";
import {useMap, useMapEvents, Popup, Marker} from 'react-leaflet'
import LocationContext from '../authAndContext/locationProvider';
import L from "leaflet";

export default function LocationMarker() {
    const {location, generateLocation, range} = useContext(LocationContext);
    const [map] = useState(useMap());
    const [circle] = useState(L.circle({lat: location.lat, lng: location.lng}, range));

    useMapEvents({
        dblclick(e) {
            generateLocation({lat: e.latlng.lat, lng: e.latlng.lng});
        }
    });

    useEffect(() => {
        circle.addTo(map)
    });

    useEffect(() => {
        map.flyTo({lat: location.lat, lng: location.lng}, 10); 
        circle.setRadius(range);
        circle.setLatLng({lat: location.lat, lng: location.lng});
        map.fitBounds(circle.getBounds());
    }, [location, range, map, circle]);

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
