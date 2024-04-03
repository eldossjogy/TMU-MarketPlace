import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLongRightIcon, HeartIcon } from "@heroicons/react/24/solid";
import CardImages from "./CardImages";
import SearchContext from "../authAndContext/searchProvider";
import toast from "react-hot-toast";


export default function HorizontalCard({
	image,
	price,
	description,
	title,
	status,
	location,
	postID,
	date,
	distance,
	is_saved = false,
	show_saved = false
}) {
    const {addToSaved, deleteFromSaved, userSavedIDs} = useContext(SearchContext);
	const [hovered, setHovered] = useState(false);
	const rawDate = new Date(date ?? '01/16/2024');
	const rawAge = Date.now() - rawDate.getTime();

	const weeks = Math.round(rawAge / (1000 * 3600 * 24 * 7));
	const days = Math.round(rawAge / (1000 * 3600 * 24));
	const hours = Math.round(rawAge / (1000 * 3600));
	const minutes = Math.round(rawAge / (1000 * 60));
	const seconds = Math.round(rawAge / (1000));

	const age = weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : days > 0 ? `${days} day${days > 1 ? 's' : ''} ago` : hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ago` : minutes > 0 ? `${minutes}m ago` : `${seconds}s ago`

	const handleSaved = (e) => {
		if(e) e.preventDefault();
		if(userSavedIDs[postID]){
			toast.promise(deleteFromSaved(postID), {loading: 'Removing from Saved...', success: 'Unsaved', error: 'Unable to unsave'});
		}
		else{
			toast.promise(addToSaved(postID), {loading: 'Saving...', success: 'Saved', error: 'Unable to save'});
		}
	}

	return (
		<Link to={{ pathname: `/ad/${postID}` }}
		>
			<div className="hover:cursor-pointer relative group" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
				<div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg p-3 space-x-3 flex  max-h-40 lg:max-h-72 overflow-hidden">
					<section className="max-w-32 lg:max-w-60 2xl:max-w-72 my-auto h-full rounded-md relative">
						<CardImages image={image} hovered={hovered} setHovered={setHovered} vertical={false} />
						<HeartIcon className={`${show_saved ? '' : `hidden group-hover:block ${is_saved ? '-rotate-6' : ''}`} absolute top-1 start-1 w-6 h-6 md:w-8 md:h-8 hover:rotate-6 ${is_saved ? 'text-rose-500 hover:text-white/25 hover:stroke-rose-500' : 'text-white/25 stroke-rose-500'} hover:text-rose-600`} onClick={handleSaved}/>
					</section>
						
					<section className="w-full flex flex-row-reverse">
						<section className="flex flex-col justify-between text-right min-w-12 md:min-w-24 items-end">
							<div className="overflow-hidden">
								<h2 className="text-green-700 font-bold text-xs sm:text-sm md:text-lg line-clamp-1">C${price}</h2>
								<h2 className="text-rose-700 font-bold text-xs sm:text-sm md:text-base line-clamp-1">{(status?.id !== 1) ? status?.type ?? '' : ''}</h2>
							</div>
							<button className="w-full rounded-md shadow-md bg-[#F9B300] hover:bg-[#f9a200] text-black hidden group-hover:flex justify-center items-center py-1 max-w-20"><ArrowLongRightIcon className="h-6 w-6"/></button>
						</section>
						<section className="flex flex-col justify-between w-full">
							<div>
								<div className="flex justify-between pb-2">
									<p className="line-clamp-1 font-bold text-xl    ">{title}</p>
								</div>
								<div className="sm:min-h-16">
									<p className="line-clamp-1 sm:line-clamp-2 lg:line-clamp-4">{description}</p>
								</div>
							</div>
							<div className="block sm:flex sm:flex-nowrap sm:space-x-4">
								<div className="h-auto line-clamp-1 font-bold max-w-72">📍 {location}</div>
								<div className="h-auto line-clamp-1">{String(age)}</div>
								<div className="h-auto line-clamp-1">{distance ? `${parseInt(distance)} m away` : ''}</div>
							</div>
						</section>
					</section>
					
				</div>
			</div>
		</Link>
	);
}
