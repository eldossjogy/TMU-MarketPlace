import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../authAndContext/contextApi';
import LoadingScreen from './LoadingScreen';
import noImage from '../assets/noImage.png'
import { Link, useNavigate } from 'react-router-dom';
import CardImages from './CardImages';
import { Listbox } from '@headlessui/react';

export default function MyListingCard({ listingInfo }) {

    const { statusList, setLoadingState, loadingState, changeListingStatusAPI, deleteListing } = useContext(AuthContext)

    const navigate = useNavigate();
    const [isPhone, setIsPhone] = useState(false);
    const [modal, setModal] = useState(false)
	const [hovered, setHovered] = useState(false);

    //function to trunacate strings and end with ...
    //params str, and word count limit
    function truncateString(str, limit) {
        if (str.length <= limit) {
            return str; // Return the original string if within the limit
        } else {
            // Truncate the string and append "..."
            return str.substring(0, limit) + '...';
        }
    }

    //function to quickly change status of a post
    function changeListingStatus(e) {
        //start the loading
        //pass the listing id and as well status chosen
        if (e) {
            setLoadingState(true)
            changeListingStatusAPI(listingInfo, e)
        }
    }

    function handleDeleteEntry() {
        setLoadingState(true)
        setModal(false)
        deleteListing(listingInfo)
    }
    
    const rawDate = new Date(listingInfo.created_at ?? '01/16/2024');
    const parsedDate = `${String(rawDate.getDate()).padStart(2, '0')}/${String(rawDate.getMonth()).padStart(2, '0')}/${rawDate.getFullYear()} ${String(rawDate.getHours()).padStart(2, '0')}:${String(rawDate.getMinutes()).padStart(2, '0')}:${String(rawDate.getSeconds()).padStart(2, '0')}`

    return (

        <div className="hover:cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

            <div className='myListingCardContainer'>
                <div className='cardImageContainer'>
                    <img src={(listingInfo.image.length !== 0) ? listingInfo.image[0].file_path : noImage}></img>
                </div>
                <div className='listingInfoContainer'>
                    <div className='cardLeftSection'>
                        <h1 className='font-bold text-[2em]'>{isPhone ? truncateString(listingInfo.title, 25) : truncateString(listingInfo.title, 50)}</h1>
                        <div className='flex justify-between'>
                            <h3 className='text-green-500 font-bold text-[1.3em]'>${listingInfo.price}</h3>
                            <div className="h-auto line-clamp-1 sm:line-clamp-none text-[1.3em]">📍{listingInfo.location}</div>
                        </div>
                        <p className='mt-2 text-[1.2em]'>{isPhone ? truncateString(listingInfo.description, 65) : truncateString(listingInfo.description, 200)} </p>
                    </div>
                    <div className='cardRightSection'>
                        <div className='sm:w-[50%] md:w-[80%] lg:w-[35%] relative flex flex-col md:flex-row md:gap-1 md:justify-end md:items-end sm:items-start'>
                            <p className='font-bold text-[1.5em]'>
                                Status:
                            </p>
                            <select onChange={changeListingStatus} className={`selectContainer font-bold text-black rounded text-[1.5em] ${listingInfo.status.type === "Available" && 'bg-green-400'} ${listingInfo.status.type === "Sold" && 'bg-red-400'} ${listingInfo.status.type === "Pending" && 'bg-yellow-400'} ${listingInfo.status.type === "Unavailable" && 'bg-blue-400'}`}>
                                <option value='' style={{ backgroundColor: listingInfo.status.type === "Available" ? '#6EE7B7' : listingInfo.status.type === "Sold" ? '#F87171' : listingInfo.status.type === "Pending" ? '#FBBF24' : listingInfo.status.type === "Unavailable" ? '#60A5FA' : '' }} >{listingInfo.status.type}</option>
                                {statusList.map((elem, index) => (
                                    elem.type !== listingInfo.status.type && <option className="text-black" style={{ backgroundColor: elem.type === "Available" ? '#6EE7B7' : elem.type === "Sold" ? '#F87171' : elem.type === "Pending" ? '#FBBF24' : elem.type === "Unavailable" ? '#60A5FA' : '' }} key={index} value={elem.type}>{elem.type}</option>
                                ))}
                            </select>
                        </div>
                        <div className='cardButtons'>
                            <button onClick={() => { setModal(prev => !prev) }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-[1.5em] 2xl:w-[35%]">
                                Remove
                            </button>
                            <button onClick={() => navigate(`edit-listing/${listingInfo.id}`)} className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-[1.5em] 2xl:w-[35%]">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#fafafb] border-2 border-gray rounded-lg shadow-md hover:shadow-lg m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">


                <section className="max-w-32 lg:max-w-60 2xl:max-w-72 my-auto h-full rounded-md bg-[#fafafb] ">
                    <CardImages image={listingInfo.image} hovered={hovered} setHovered={setHovered} vertical={false} />
                </section>
                    
                <section className="w-full flex flex-row-reverse">
                    <section className="flex flex-col justify-between text-right min-w-12 md:min-w-48 items-end">
                        <div className="overflow-hidden">
                            <h2 className="text-green-700 font-bold text-xs sm:text-sm md:text-lg line-clamp-1">C${listingInfo.price}</h2>
                            {/* <h2 className="text-rose-700 font-bold text-xs sm:text-sm md:text-base line-clamp-1">{(listingInfo.status?.id !== 1) ? listingInfo.status?.type ?? '' : ''}</h2> */}
                            <Listbox value={listingInfo.status.id} onChange={changeListingStatus}>
                                <Listbox.Button>{listingInfo.status.type}</Listbox.Button>
                                <Listbox.Options>
                                    {statusList.map((status, index) => (
                                    <Listbox.Option
                                        key={index}
                                        value={status.type}
                                    >
                                        {status.type}
                                    </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                        </div>
                        <div className='flex w-full gap-2'>
                            <button onClick={() => { setModal(prev => !prev) }} className="w-full rounded-md shadow-md bg-rose-500 hover:bg-rose-600 text-white justify-center items-center py-1 md:p-2">Delete</button>
                            <Link to={{ pathname: `/edit-listing/${listingInfo.id}` }} className='w-full'>
                                <button className="w-full rounded-md shadow-md bg-[#F9B300] hover:bg-[#f9a200] text-white justify-center items-center py-1 md:p-2">Edit</button>
                            </Link>
                        </div>
                    </section>
                    <section className="flex flex-col justify-between w-full">
                        <div>
                            <div className="flex justify-between pb-2">
                                <p className="line-clamp-1 font-bold text-xl    ">{listingInfo.title}</p>
                            </div>
                            <div className="sm:min-h-16">
                                <p className="line-clamp-1 sm:line-clamp-2 lg:line-clamp-4">{listingInfo.description}</p>
                            </div>
                        </div>
                        <div className="block sm:flex sm:flex-nowrap sm:space-x-4">
                            <div className="h-auto line-clamp-1 font-bold max-w-72">📍 {listingInfo.location}</div>
                            <div className="h-auto line-clamp-1">{String(parsedDate)}</div> {/* String(age) */}
                            {/* <div className="h-auto line-clamp-1">{distance ? `${parseInt(distance)} m away` : ''}</div> */}
                        </div>
                    </section>
                </section>
                
            </div>
            {loadingState &&
                <LoadingScreen message={"Changing Ad status..."} />
            }
            {modal &&
                <div className="dashboard-Item-Modal flex flex-col -mt-3 mx-3 p-3 rounded shadow-md hover:shodow-lg bg-red-500 text-white">
                    <div className="w-full flex items-center flex-col md:gap-5 gap-2">
                        <div className="flex items-center w-full">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 rounded-2xl p-3 border border-blue-100 text-blue-400 bg-blue-50" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div className="flex flex-col ml-3">
                                <div className="md:text-[1.5em] text-[1em] leading-none">Delete Ad '{listingInfo.title}' ?</div>
                                <p style={{ color: 'white' }} className="md:text-[1.3em] text-[0.8em] leading-none mt-1">Your listing will be removed and wont be active for others!
                                </p>
                            </div>
                        </div>
                        <div className='flex md:gap-5 gap-2'>
                            <button onClick={handleDeleteEntry} className="font-bold flex-no-shrink bg-white lg:px-5 lg:ml-4 lg:py-2 p-2 md:text-[1.5em] shadow-sm hover:shadow-lg tracking-wider border-2 border-white text-red-500 rounded-md hover:underline">Delete</button>
                            <button className="font-bold flex-no-shrink bg-blue-500 lg:px-5 lg:ml-4 lg:py-2 p-2 md:text-[1.5em] shadow-sm hover:shadow-lg tracking-wider border-2 border-blue-500 text-white-500 rounded-md hover:underline"
                                onClick={() => { setModal(prev => !prev) }}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
