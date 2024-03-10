import { useState, useContext } from "react";
import { useMapEvents } from "react-leaflet";
import LeafletControl from "./LeafletControl";
import { MapPinIcon } from "@heroicons/react/24/solid";
import LocationContext from '../authAndContext/locationProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function LocateControl() {

	const { getLocation } = useContext(LocationContext);

	return (
		<LeafletControl position={"topright"}>
			<button role='button' onClick={() => { getLocation(); }} className='flex items-center bg-white hover:bg-sky-400 py-2 px-4 rounded-lg '>
				<FontAwesomeIcon icon="fa-solid fa-location-arrow" className='h-4 w-4 aspect-square stroke-white'/>
			</button>
		</LeafletControl>
	);
}