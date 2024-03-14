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

	const age = weeks > 0 ? `${weeks} weeks ago` : days > 0 ? `${days} days ago` : hours > 0 ? `${hours} hours ago` : minutes > 0 ? `${minutes}m ago` : `${seconds}s ago`
	return (
		<Link to={{ pathname: `/${postID}` }}
		>
			<div className="hover:cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
				<div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72">
					<section className="max-w-32 lg:max-w-60 my-auto h-full rounded-md bg-[#fafafb] ">
						{ Array.isArray(image) ? <ImageCarousel images={image} hovered={hovered} setHovered={setHovered} vertical={false}/> 
							:
							<img
								className="rounded-md object-cover aspect-square md:max-w-30 lg:max-w-60 h-auto"
								src={image}
								alt="img"
							></img>
						}
					</section>
						
					<section className="w-full flex flex-row-reverse">
						<section className="flex flex-col justify-between text-right">
							<div>
								<h2 className="text-green-700 font-bold text-sm md:text-lg">C${price}</h2>
								<h2 className="text-rose-700 font-bold text-sm md:text-base">{(status?.id !== 1) ? status?.type ?? '' : ''}</h2>
							</div>
							<button className="rounded-md shadow-md bg-[#F9B300] hover:bg-[#f9a200] text-black hidden group-hover:flex justify-center items-center py-1 max-w-20"><ArrowLongRightIcon className="h-6 w-6"/></button>
						</section>
						<section className="flex flex-col justify-between w-full">
							<div>
								<div className="flex justify-between pb-2">
									<p className="line-clamp-1 font-bold text-xl    ">{title}</p>
								</div>
								<div className="min-h-16">
									<p className="line-clamp-2 lg:line-clamp-4">{description}</p>
								</div>
							</div>
							<div className="flex space-x-4">
								<div className="h-auto">📍{location}</div>
								<div className="h-auto">{String(age)}</div>
							</div>
						</section>
					</section>
					
				</div>
			</div>
		</Link>
	);
}
