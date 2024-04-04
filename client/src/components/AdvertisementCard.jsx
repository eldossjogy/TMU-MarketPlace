import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import VerticalCard from "./VerticalCard";
import SearchContext from "../authAndContext/searchProvider";
import ImageArrowCarousel from "./ImageArrowCarousel";
import CardImages from "./CardImages";



function AdvertisementCard({
    dbData,
    similarAds
}) {
    //state variable will change based on whether user hovers over an image
    //on the advertisement card
    const [hovered, setHovered] = useState(false);
    const {userSavedIDs} = useContext(SearchContext);

    const navigate = useNavigate()

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname]); 

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
                <div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg p-3 sm:space-x-3 flex md:flex-row flex-col overflow-hidden" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                    <div className="md:w-3/5 sm:w-full flex justify-center items-center">
                        {/*carousel component*/}
                        <CardImages image={dbData.image} hovered={true} setHovered={setHovered} autoScrollBool={false}/>
                        {/*<ImageArrowCarousel images={dbData.image} />*/}
                    </div>
                    <div className="flex flex-col justify-between w-full sm:px-4 pb-4 bg-[#fafafb]">
                       <div className="flex flex-col justify-cente">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                                {dbData.category.name}: {dbData.title}
                            </h1>   
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-left text-md sm:text-lg">Location:📍{dbData.location}</h2>
                                    <h2 className="text-md">Listing created at: {}</h2>
                                </div>
                                <h2 className="text-green-600 text-xl font-bold text-right">${dbData.price}</h2>
                            </div><br></br>
                            <h2 className="">{dbData.description}</h2>
                       </div>
                       <div className="flex justify-between">
                            <Link to={`/u/${dbData.profile.name}`} className="flex flex-row-reverse gap-4">
                                <section className="flex h-full w-auto items-center justify-center">
                                    <Avatar userID={dbData.user_id} size={'10'}/>
                                </section>
                                <section className="flex flex-col w-fit">
                                    <div className="flex w-full justify-between gap-4">
                                        <p className="flex shrink-0">Posted by:</p>
                                        <p className="w-full">{dbData.profile.name}</p>
                                    </div>
                                    <div className="flex w-full justify-between gap-4">
                                        <p className="flex shrink-0">Posted on:</p>
                                        <p className="w-full">{formatDate(dbData.created_at)}</p>
                                    </div>
                                </section>
                            </Link>
                            <button type="submit" className="bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 font-bold py-2 px-8 sm:px-12 rounded-md shadow-md">
                                Message
                            </button>    
                        </div> 
                    </div>
                </div>

            <br></br>
            <div className="bg-[#fafafb] rounded-lg border border-gray-200 p-3 flex md:flex-row flex-col gap-3">
                <div className="md:w-1/2 sm:w-full flex justify-center items-center">
                    {/* <Link to={`/u/${dbData.profile.name}`} className="flex flex-col items-center justify-start pb-10 gap-3">
                        <h1 className="text-2xl sm:text-xl md:text-2xl font-bold text-gray-900">
                            Created by
                        </h1>
                        <Avatar userID={dbData.user_id} />
                        <h5 className="text-xl font-medium text-gray-900">{dbData.profile.name}</h5>
                        <span className="text-sm text-gray-500">{dbData.profile.first_name}&nbsp;{dbData.profile.last_name}</span>
                        <span className="text-sm text-gray-500">{dbData.profile.email}</span>
                    </Link> */}
                </div>
                <div className="md:w-1/2 sm:w-full flex items-center flex-col space-x-1 gap-3">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        Other Available Listings from {dbData.profile.name}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                                onClick={() => {
                                    navigate(`/ad/${dbData.id}`)
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>


    );

}


export default AdvertisementCard;