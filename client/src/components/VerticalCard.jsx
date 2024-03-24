import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardImages from "./CardImages";

export default function VerticalCard({
  image,
  price,
  description,
  title,
  location,
  distance,
  postID
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={{ pathname: `/ad/${postID}` }}
    >
      <div id="card" className="hover:cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="bg-[#fafafb] rounded-lg border-2 border-gray shadow-md hover:shadow-lg overflow-hidden">
          <div className="mr-auto ml-auto rounded-md bg-[#fafafb] p-4">
            <CardImages image={image} setHovered={setHovered} hovered={hovered} />
          </div>
          <div className="px-4 pb-4 bg-[#fafafb]">
            <div className="flex justify-between pb-2 items-center">
              <p className="line-clamp-1 font-bold text-xl">{title}</p>
              <h2 className="text-green-600 font-bold sm:text-lg md:text-sm xl:text-lg">${price}</h2>
            </div>
            <div className="min-h-16">
              <p className="line-clamp-2">{description}</p>
            </div>
            <span className="block sm:flex sm:flex-nowrap sm:space-x-4">
              <div className="h-auto line-clamp-1">📍{location}</div>
              <div className="h-auto line-clamp-1">{distance ? `${parseInt(distance)} m` : ''}</div>  
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
