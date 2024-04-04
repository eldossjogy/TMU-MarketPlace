import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import StarRating from "./StarRating";
import Loading from "./Loading";
import CardImages from "./CardImages";
import Avatar from "./Avatar";



function AdvertisementCard({
    image,
    price,
    dateposted,
    description,
    title,
    location,
    postID,
    userimg,
    sellername,
    rating,
    ad1,
    ad2,
    ad3,
}) {
    //state variable will change based on whether user hovers over an image
    //on the advertisement card
    const [hovered, setHovered] = useState(false);

    return (
        <div className="w-full">
                <div className="bg-[#fafafb] rounded-lg border border-gray-200 p-4 flex hover:cursor-pointer overflow-hidden" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                    <div className="w-3/5 flex justify-center items-center">
                        {/*carousel component*/}
                            <CardImages image={image} hovered={hovered} setHovered={setHovered}/>
                    </div>
                    <div className="w-full px-4 pb-4 bg-[#fafafb]">
                        <p className="line-clamp-1 font-bold text-4xl">{title}</p>
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-left text-lg">{location}</h2>
                                <h6 className="text-xs">{dateposted}</h6>
                            </div>
                            <h2 className="text-green-600 text-xl font-bold text-right">${price}</h2>
                        </div><br></br>
                        <h2 className="">{description}</h2>
                        <div className="flex justify-end">
                            <button className="bg-[#fef08a] text-center rounded-lg px-4 py-2 font-bold border border-black border-opacity-25 hover:bg-opacity-50">Message</button>
                        </div>

                    </div>
                </div>



            <br></br>
            <div className="bg-[#fafafb] rounded-lg border border-gray-200 p-4 flex">
                <Link to={`/u/${sellername}`} className="w-1/2 flex justify-center items-center">
                    <Avatar userID={userimg} />
                    <div className="w-1/2 items-center p-5">
                        <div className="bg-[#f3f4f6] rounded-lg border border-gray-200 p-4 text-center shadow-lg">
                            <h2 className="text-center">{sellername}</h2>
                        </div>
                        <br></br>
                        <div className="flex justify-center items-center">
                            <h2>{rating}</h2>
                        </div>
                    </div>
                </Link>
                <div className="w-1/2 flex justify-center items-center space-x-1">
                    <div className="w-1/3 bg-[#fafafb] rounded-lg border border-gray-200 p-2 shadow-lg">
                        <div className="rounded-md bg-[#fafafb]">
                            <img className="rounded-md w-full h-auto object-cover  aspect-square" src={ad1} alt="img"></img>
                        </div>
                        <h2 className="line-clamp-1 font-bold text-xl">{title}</h2>
                        <h2 className="text-green-600 text-lg text-left">${price}</h2>

                    </div>
                    <div className="w-1/3 bg-[#fafafb] rounded-lg border border-gray-200 p-2 shadow-lg">
                        <div className="rounded-md bg-[#fafafb]">
                            <img className="rounded-md w-full h-auto object-cover  aspect-square" src={ad2} alt="img"></img>
                        </div>
                        <h2 className="line-clamp-1 font-bold text-xl">{title}</h2>
                        <h2 className="text-green-600 text-lg text-left">${price}</h2>

                    </div>
                    <div className="w-1/3 bg-[#fafafb] rounded-lg border border-gray-200 p-2 shadow-lg">
                        <div className="rounded-md bg-[#fafafb]">
                            <img className="rounded-md w-full h-auto object-cover  aspect-square" src={ad3} alt="img"></img>
                        </div>
                        <h2 className="line-clamp-1 font-bold text-xl">{title}</h2>
                        <h2 className="text-green-600 text-lg text-left">${price}</h2>

                    </div>

                </div>
            </div>

        </div>


    );

}


export default AdvertisementCard;
