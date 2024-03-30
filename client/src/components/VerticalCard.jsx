import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CardImages from "./CardImages";
import SearchContext from "../authAndContext/searchProvider";
import toast from "react-hot-toast";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function VerticalCard({
  image,
  price,
  description,
  title,
  location,
  date,
  distance,
  postID,
  is_saved = false,
	show_saved = false
}) {
  const {addToSaved, deleteFromSaved, userSavedIDs} = useContext(SearchContext);
  const [hovered, setHovered] = useState(false);
	const [saved, setSaved] = useState(is_saved);

	const handleSaved = (e) => {
		if(e) e.preventDefault();
		if(userSavedIDs[postID]){
			toast.promise(deleteFromSaved(postID), {loading: 'Removing from Saved...', success: 'Unsaved', error: 'Unable to unsave'}).then((val) => {setSaved(!isNaN(val[postID]) ? true : false);});
		}
		else{
			toast.promise(addToSaved(postID), {loading: 'Saving...', success: 'Saved', error: 'Unable to save'}).then((val) => {setSaved(!isNaN(val[postID]) ? true : false)});
		}
	}

  const rawDate = new Date(date ?? '01/16/2024');
	const rawAge = Date.now() - rawDate.getTime();

	const weeks = Math.round(rawAge / (1000 * 3600 * 24 * 7));
	const days = Math.round(rawAge / (1000 * 3600 * 24));
	const hours = Math.round(rawAge / (1000 * 3600));
	const minutes = Math.round(rawAge / (1000 * 60));
	const seconds = Math.round(rawAge / (1000));

	const age = weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : days > 0 ? `${days} day${days > 1 ? 's' : ''} ago` : hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ago` : minutes > 0 ? `${minutes}m ago` : `${seconds}s ago`

  return (
    <Link to={{ pathname: `/ad/${postID}` }}
    >
      <div id="card" className="hover:cursor-pointer group" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="bg-[#fafafb] rounded-lg border-2 border-gray shadow-md hover:shadow-lg overflow-hidden">
          <div className="mr-auto ml-auto rounded-md bg-[#fafafb] p-3 relative">
            <CardImages image={image} setHovered={setHovered} hovered={hovered} />
				    <HeartIcon className={`${show_saved ? '' : `hidden group-hover:block ${saved ? '-rotate-6' : ''}`} absolute top-4 start-4 w-12 h-12 md:w-6 md:h-6 hover:rotate-6 ${saved ? 'text-rose-500 hover:text-white/25 hover:stroke-rose-500' : 'text-white/25 stroke-rose-500'} hover:text-rose-600`} onClick={handleSaved}/>
          </div>
          <div className="px-3 pb-3 bg-[#fafafb]">
            <div className="flex justify-between pb-2 items-center">
              <p className="line-clamp-1 font-bold text-xl">{title}</p>
              <h2 className="text-green-600 font-bold sm:text-lg md:text-sm xl:text-lg">${price}</h2>
            </div>
            <div className="min-h-16">
              <p className="line-clamp-2">{description}</p>
            </div>
            <span className="block sm:flex sm:flex-nowrap sm:space-x-4">
              <div className="h-auto line-clamp-1">📍{location ? location : age}</div>
              <div className="h-auto line-clamp-1">{distance ? `${parseInt(distance)} m` : ''}</div>  
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
