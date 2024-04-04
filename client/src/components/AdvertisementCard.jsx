import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Popup, Marker} from 'react-leaflet'
import SearchContext from "../authAndContext/searchProvider";
import ChatContext from "../authAndContext/chatProvider";
import AuthContext from "../authAndContext/contextApi";
import VerticalCard from "./VerticalCard";
import CardImages from "./CardImages";
import toast from "react-hot-toast";
import Avatar from "./Avatar";

function AdvertisementCard({
    dbData,
    similarAds
}) {
    const [hovered, setHovered] = useState(false);
    const [chatMessage, setChatMessage] = useState('Is this still available?');
    const {userSavedIDs, addToHistory} = useContext(SearchContext);
    const {user} = useContext(AuthContext);
    const {createChat} = useContext(ChatContext);

    const navigate = useNavigate()

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname]); 

    
    const handleChange = (e) => {
        e.preventDefault();
        setChatMessage(e.target.value);
    };

    const handleStartChat = (e) => {
        if(e) e.preventDefault();
        toast.promise(createChat(dbData.id, chatMessage), {loading: 'Sending message...', success: "Send Message", error: "Failed to send message"}).then(
            () => {setChatMessage('')}, () => {console.log('Unable to create chat');}
        );
    }

    useEffect(() => {
        addToHistory(dbData.id);
    },[])

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
                <div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg p-3 gap-3 flex md:flex-row flex-col overflow-hidden" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                    <div className="md:w-3/5 sm:w-full flex justify-center items-center">
                        {/*carousel component*/}
                        <CardImages image={dbData.image} hovered={true} setHovered={setHovered} autoScrollBool={false}/>
                        {/*<ImageArrowCarousel images={dbData.image} />*/}
                    </div>
                    <div className="flex flex-col justify-between items w-full bg-[#fafafb] gap-y-12">
                        <div className="flex flex-col justify-center gap-4">
                            <section className="flex justify-between">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                    {dbData.title}
                                </h1>   
                                <div className="min-w-40">
                                    <div className="flex gap-2">
                                        <h2 className="flex text-xl font-bold text-right line-clamp-1">{dbData.category.name}: </h2>
                                        <h2 className="text-green-600 text-xl font-bold text-right">${dbData.price}</h2>
                                    </div>
								    <h2 className="text-rose-700 font-bold text-xs sm:text-sm md:text-base line-clamp-1">{(dbData?.status_id !== 1) ? dbData?.status?.type ?? '' : ''}</h2>
                                </div>
                            </section>
                            <h2 className="">{dbData.description}</h2>
                       </div>
                       <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
                            <Link to={`/u/${dbData.profile.name}`} className="flex lg:flex-row-reverse gap-4 shrink-0">
                                <section className="flex h-full w-auto items-center justify-center">
                                    <Avatar userID={dbData.user_id} size={'10'}/>
                                </section>
                                <section className="flex flex-col w-fit">
                                    <div className="flex w-full justify-between gap-4">
                                        <p className="flex shrink-0 font-bold">Posted by:</p>
                                        <p className="w-full">{dbData.profile.name}</p>
                                    </div>
                                    <div className="flex w-full justify-between gap-4">
                                        <p className="flex shrink-0 font-bold">Posted on:</p>
                                        <p className="w-full">{formatDate(dbData.created_at)}</p>
                                    </div>
                                </section>
                            </Link>
                            <form className='h-auto flex justify-center items-center flex-row-reverse z-50 rounded-xl w-full lg:w-1/2' onSubmit={handleStartChat}>
                                {dbData.user_id !== user?.id && (
                                    <>
                                        <button type="submit" className="bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 font-bold py-2 px-8 sm:px-12 rounded-r-md shadow-md">
                                            Message
                                        </button>
                                        <input className='w-full bg-neutral-100 rounded-l-2xl border-gray-200' placeholder='Send a message' name='message' aria-label='message' value={chatMessage} onChange={handleChange}></input>
                                    </>
                                )}
                            </form>
                        </div> 
                    </div>
                </div>

            <br></br>
            <div className="bg-[#fafafb] rounded-lg border border-gray-200 p-3 flex lg:flex-row flex-col gap-6">
                <div className="lg:w-1/2 sm:w-full flex justify-center flex-col gap-3">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        Location: {dbData.location}
                    </h1>
                    <div className="aspect-video rounded-xl overflow-hidden ring-2 ring-neutral-400 w-full max-h-96" id="map">
                        <MapContainer center={[dbData.lat, dbData.lng]} zoom={10} scrollWheelZoom={true} className="h-full" doubleClickZoom={true} attributionControl={false} zoomControl={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={{lat: dbData.lat, lng: dbData.lng}}>
                                <Popup>{'Ad location'}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>   
                </div>
                <div className="lg:w-1/2 sm:w-full flex items-center flex-col gap-3 justify-center">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        Other Available Listings from {dbData.profile.name}
                    </h1>
                    <div className={(!similarAds || (similarAds && similarAds.length === 0)) ? 'gap-3' : `gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
                        {similarAds && similarAds.length > 0 && similarAds.map((element, index) => (
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
                        {(!similarAds || (similarAds && similarAds.length === 0)) && [1].map((key) => (
							<div key={key} className="m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">
								<div className="max-w-xl mx-auto sm:px-6 lg:px-8">
									<div className="flex items-center pt-8 sm:justify-start sm:pt-0">
										<div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">No Results</div>
									</div>
								</div>
							</div>
						))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdvertisementCard;