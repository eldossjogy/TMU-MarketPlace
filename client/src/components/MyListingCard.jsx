import React, { Fragment, useContext, useEffect, useState } from 'react'
import AuthContext from '../authAndContext/contextApi';
import LoadingScreen from './LoadingScreen';
import noImage from '../assets/noImage.png'
import { Link, useNavigate } from 'react-router-dom';
import CardImages from './CardImages';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

export default function MyListingCard({ listingInfo }) {

    const { statusList, setLoadingState, loadingState, changeListingStatusAPI, deleteListing } = useContext(AuthContext)
    const [isShowing, setIsShowing] = useState(false)
    const [modal, setModal] = useState(false)
	const [hovered, setHovered] = useState(false);
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

        <div className="" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className={`bg-[#fafafb] border-2 border-gray ${modal ? 'rounded-t-lg' : 'rounded-xl'} shadow-md hover:shadow-lg p-3 space-x-3 flex group max-h-40 lg:max-h-72`}>
                <section className="max-w-32 lg:max-w-60 2xl:max-w-72 my-auto h-full rounded-md">
                    <CardImages image={listingInfo.image} hovered={hovered} setHovered={setHovered} vertical={false} />
                </section>

                <section className="w-full flex flex-col justify-between sm:justify-normal sm:flex-row">
                    <section className="w-full flex flex-row-reverse">
                        <section className="flex flex-col justify-between text-right min-w-16 sm:min-w-24 md:min-w-32 lg:min-w-40 xl:min-w-64 items-end">
                            <div className="w-full ps-1 sm:ps-0">
                                <h2 className="text-green-700 font-bold text-xs sm:text-sm md:text-lg line-clamp-1">C${listingInfo.price}</h2>
                                {/* <h2 className="text-rose-700 font-bold text-xs sm:text-sm md:text-base line-clamp-1">{(listingInfo.status?.id !== 1) ? listingInfo.status?.type ?? '' : ''}</h2> */}
                                <Listbox value={listingInfo.status_id} onChange={changeListingStatus}>
                                    <div className="relative mt-1 w-full">
                                        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white p-1 md:py-2 md:pl-3 md:pr-10 sm:text-left ring-gray-200 ring-2 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <h2 className={`${listingInfo.status_id !== 1 ? 'text-rose-700 ' : ''} text-xs sm:text-sm md:text-base line-clamp-1`}>{listingInfo.status.type}</h2>
                                            {/* <span className="block truncate">{listingInfo.status.type}</span> */}
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                                className="hidden sm:block h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-xs sm:text-sm md:text-base z-50">
                                            {statusList.map((status) => (
                                                <Listbox.Option
                                                    key={status.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none p-1 sm:py-2 sm:pl-10 sm:pr-4 ${
                                                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={status.id}
                                                >
                                                    {({ selected }) => (
                                                        <div className='flex'>
                                                            <span
                                                                className={`block truncate ${
                                                                selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                            >
                                                                {status.type}
                                                            </span>
                                                            {selected ? (
                                                                <span className="hidden sm:flex absolute inset-y-0 left-0  items-center pl-3 text-amber-600">
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className='hidden sm:flex w-full gap-2'>
                                <button onClick={() => { setModal(prev => !prev) }} className="w-full rounded-md shadow-md ring-inset ring-1 ring-rose-500 hover:bg-rose-400 text-gray-900 justify-center items-center text-xs sm:text-sm md:text-base p-1 lg:p-2">Delete</button>
                                <Link to={{ pathname: `/my-market/edit-listing/${listingInfo.id}` }} className='w-full'>
                                    <button className="w-full rounded-md shadow-md bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 justify-center items-center p-1 lg:p-2">Edit</button>
                                </Link>
                            </div>
                        </section>
                        <section className="flex flex-col justify-between w-full">
                            <div>
                                <div className="flex justify-between pb-2">
                                    <p className="line-clamp-1 font-bold text-sm md:text-xl">{listingInfo.title}</p>
                                </div>
                                <div className="sm:min-h-16">
                                    <p className="text-xs md:text-base line-clamp-1 sm:line-clamp-2 lg:line-clamp-4">{listingInfo.description}</p>
                                </div>
                            </div>
                            <div className="hidden text-xs md:text-base sm:flex sm:flex-nowrap sm:space-x-4">
                                <div className="h-auto line-clamp-1 font-bold w-fit">📍 {listingInfo.location}</div>
                                <div className="h-auto line-clamp-1">{String(parsedDate)}</div> {/* String(age) */}
                                {/* <div className="h-auto line-clamp-1">{distance ? `${parseInt(distance)} m away` : ''}</div> */}
                            </div>
                        </section>
                    </section>
                    <section className='w-full flex gap-2 sm:hidden justify-end'>
                        <button onClick={() => { setModal(prev => !prev) }} className="w-full max-w-16 rounded-md shadow-md ring-inset ring-1 ring-rose-500 hover:bg-rose-400 text-gray-900 justify-center items-center text-xs p-1">Delete</button>
                        <Link to={{ pathname: `/my-market/edit-listing/${listingInfo.id}` }} className='w-full max-w-16 '>
                            <button className="w-full rounded-md shadow-md bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 justify-center items-center text-xs p-1">Edit</button>
                        </Link>
                    </section>    
                </section>
                
            </div>
                                                        
            {loadingState &&
                <LoadingScreen message={"Changing Ad status..."} />
            }
            <Transition
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="opacity-0 -translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-full"
                show={modal}
            >
                <div className="flex flex-col -mt-3 p-3 rounded-b-xl shadow-md hover:shadow-lg ring-inset ring-2 ring-rose-600 bg-white text-gray-900">
                    <div className="w-full flex items-center flex-col md:gap-5 gap-2">
                        <div className="flex items-center w-full">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 rounded-2xl p-3 border border-blue-100 text-blue-400 bg-blue-50" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div className="flex flex-col ml-3">
                                <div className="md:text-xl leading-none">Delete Ad '{listingInfo.title}' ?</div>
                                <p className="md:text-lg leading-none mt-1">Your listing will be removed and wont be active for others!
                                </p>
                            </div>
                        </div>
                        <div className='flex md:gap-5 gap-2'>
                            <button onClick={() => { setModal(prev => !prev) }} className="w-full rounded-xl shadow-xl ring-inset ring-1 ring-rose-500 hover:bg-rose-400 text-gray-900 text-lg justify-center items-center p-1 px-2 md:px-4">Cancel</button>
                            <button onClick={handleDeleteEntry} className="w-full rounded-xl shadow-xl bg-[#F9B300] hover:bg-[#f9a200] text-gray-900 text-lg justify-center items-center p-1 px-2 md:px-4">Confirm</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    )
}
