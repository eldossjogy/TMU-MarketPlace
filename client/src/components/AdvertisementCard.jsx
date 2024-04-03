import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CardImages from "./CardImages";
import Avatar from "./Avatar";
import VerticalCard from "./VerticalCard";
import SearchContext from "../authAndContext/searchProvider";



function AdvertisementCard({
    dbData,
    similarAds
}) {
    //state variable will change based on whether user hovers over an image
    //on the advertisement card
    const [hovered, setHovered] = useState(false);
    const {userSavedIDs} = useContext(SearchContext);

    function formatDate(dateString) {
        const date = new Date(dateString);
        
        // Get the day, month, year, hours, minutes, and seconds
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        // Concatenate the formatted date and time
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
    
        // Return the formatted date and time
        return `${formattedDate} ${formattedTime}`;
    }
    return (
        <div className="w-full">
                <div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg p-3 space-x-3 flex overflow-hidden" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                    <div className="w-3/5 flex justify-center items-center">
                        {/*carousel component*/}
                            <CardImages image={dbData.image} hovered={hovered} setHovered={setHovered}/>
                    </div>
                    <div className="flex flex-col justify-between w-full px-4 pb-4 bg-[#fafafb]">
                       <div>
                            <p className="line-clamp-1 font-bold text-4xl">{dbData.title}</p>
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-left text-lg">📍{dbData.location}</h2>
                                    <h6 className="text-xs">{formatDate(dbData.created_at)}</h6>
                                </div>
                                <h2 className="text-green-600 text-xl font-bold text-right">${dbData.price}</h2>
                            </div><br></br>
                            <h2 className="">{dbData.description}</h2>
                       </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 font-bold py-2 px-8 sm:px-12 rounded-md shadow-md">
                                Message
                            </button>    
                        </div> 
                    </div>
                </div>
{/*<Avatar userID={dbData.user_id} />*/}


            <br></br>
            <div className="bg-[#fafafb] rounded-lg border border-gray-200 p-4 flex gap-3">
                <div className="w-1/2 flex justify-center items-center">
                    <div class="flex flex-col items-center pb-10">
                        <Avatar userID={dbData.user_id} />
                        <h5 class="mt-3 mb-1 text-xl font-medium text-gray-900 dark:text-white">{dbData.profile.name}</h5>
                        <span class="text-sm text-gray-500 dark:text-gray-400">{dbData.profile.first_name}&nbsp;{dbData.profile.last_name}</span>
                    </div>
                </div>
                <div className="w-1/2 flex flex-col space-x-1">
                    <h1 className="text-2xl sm:text-xl md:text-2xl font-bold text-gray-900 mt-2">
                        Other Available Listings from {dbData.profile.name}
                    </h1>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-3 gap-3">
                        {similarAds.map((element, index) => (
                            <VerticalCard
                                image={element.image}
                                title={element.title}
                                price={element.price.toLocaleString()}
                                location={element.location}
                                description={element.description}
                                postID={element.id}
                                key={element.id}
                                is_saved={userSavedIDs[element.id] !== undefined}
                                show_saved={true}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>


    );

}


export default AdvertisementCard;
