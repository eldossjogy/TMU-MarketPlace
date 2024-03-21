import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardImages from "./CardImages";

export default function VerticalCard({
  image,
  price,
  description,
  title,
  location,
  postID
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={{ pathname: `/ad/${postID}` }}
    >
      <div id="card" className="hover:cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="bg-[#fafafb] m-3 rounded-lg border-2 border-gray shadow-md hover:shadow-lg overflow-hidden">
          <div className="mr-auto ml-auto rounded-md bg-[#fafafb] p-4">
            <CardImages image={image} setHovered={setHovered} hovered={hovered} />
          </div>
          <div className="px-4 pb-4 bg-[#fafafb]">
            <div className="flex justify-between pb-2">
              <p className="line-clamp-1 font-bold text-xl">{title}</p>
              <h2 className="text-green-600 font-bold text-lg">${price}</h2>
            </div>
            <div className="min-h-16">
              <p className="line-clamp-2">{description}</p>
            </div>
            <div className="h-auto">📍{location}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
