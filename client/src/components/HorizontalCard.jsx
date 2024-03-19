import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";

export default function HorizontalCard({
	image,
	price,
	description,
	title,
	status,
	location,
	postID,
	date
}) {
	const [hovered, setHovered] = useState(false);
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
			<div className="hover:cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
				<div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">
					<section className="max-w-32 lg:max-w-60 my-auto rounded-md bg-[#fafafb] ">
						{ image.length > 1 ? <ImageCarousel images={image} hovered={hovered} setHovered={setHovered} vertical={false}/> 
							:
							<img
								className="rounded-md object-cover aspect-square max-w-32 lg:max-w-60 h-auto"
								src={image[0].file_path}
								alt="img"
							></img>
						}
					</section>
						
					<section className="w-full flex flex-row-reverse">
						<section className="flex flex-col justify-between text-right">
							<div className="overflow-hidden">
								<h2 className="text-green-700 font-bold text-xs sm:text-sm md:text-lg line-clamp-1">C${price}</h2>
								<h2 className="text-rose-700 font-bold text-xs sm:text-sm md:text-base line-clamp-1">{(status?.id !== 1) ? status?.type ?? '' : ''}</h2>
							</div>
							<button className="rounded-md shadow-md bg-[#F9B300] hover:bg-[#f9a200] text-black hidden group-hover:flex justify-center items-center py-1 max-w-20"><ArrowLongRightIcon className="h-6 w-6"/></button>
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
								<div className="h-auto line-clamp-1 font-bold">📍 {location}</div>
								<div className="h-auto line-clamp-1">{String(age)}</div>
							</div>
						</section>
					</section>
					
				</div>
			</div>
		</Link>
	);
}
