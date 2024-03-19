import React, { useContext, useEffect, useState } from 'react'
import ImageCarousel from './ImageCarousel'
import Logo from "../assets/logo.png"
import AuthContext from '../authAndContext/contextApi';
import LoadingScreen from './LoadingScreen';
import noImage from '../assets/noImage.png'

export default function MyListingCard({listingInfo}) {

  const {statusList, setLoadingState, loadingState, changeListingStatusAPI} = useContext(AuthContext)

  const [isPhone, setIsPhone] = useState(false);

  //useEffect that checks if user is on a phone/ needed for truncating text accordingly
  useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      setIsPhone(mediaQuery.matches); // Set initial value based on media query match

      const handleChange = (e) => {
          setIsPhone(e.matches); // Update value when media query matches change
      };

      mediaQuery.addListener(handleChange); // Listen for changes in media query matches

      return () => {
          mediaQuery.removeListener(handleChange); // Cleanup on unmount
      };
  }, []);

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
  function changeListingStatus(event) {
    //start the loading
    //pass the listing id and as well status chosen
    if (event.target.value) {
      setLoadingState(true)
      changeListingStatusAPI(listingInfo, event.target.value)
    }
    
  }

  return (
    <div className='myListingCardContainer'>
        <div className='cardImageContainer'>
          <img src={(listingInfo.image.length !== 0) ? listingInfo.image[0].file_path : noImage }></img>
        </div>
        <div className='listingInfoContainer'>
          <div className='cardLeftSection'>
            <h1 className='font-bold text-[2em]'>{isPhone ? truncateString(listingInfo.title, 25) : truncateString(listingInfo.title, 50)}</h1>
            <div className='flex justify-between'>
              <h3 className='text-green-500 font-bold text-[1.3em]'>${listingInfo.price}</h3>
              <div className="h-auto line-clamp-1 sm:line-clamp-none text-[1.3em]">📍{listingInfo.location}</div>
            </div>
            <p className='mt-2 text-[1.2em]'>{isPhone ? truncateString(listingInfo.description, 65) : truncateString(listingInfo.description, 200) } </p>
          </div>
          <div className='cardRightSection'>
            <div className='sm:w-[50%] md:w-[80%] lg:w-[35%] relative flex flex-col md:justify-end md:items-end'>
              <p className='font-bold text-[1.5em]'>Status:<span className={`font-bold ${listingInfo.status.type === "Available" && 'text-green-500'} ${listingInfo.status.type === "Sold" && 'text-red-500'} ${listingInfo.status.type === "Pending" && 'text-yellow-400'} ${listingInfo.status.type === "Unavailable" && 'text-blue-400'}`}>{listingInfo.status.type}</span></p>
              <select onChange={changeListingStatus} className="selectContainer bg-blue-500 hover:bg-blue-700 text-white font-bold rounded text-[1.5em]">
                <option value =''>Status</option>
                {statusList.map((elem, index) => (
                  <option key={index} value={elem.type}>{elem.type}</option>
                ))}
              </select>
            </div>
            <div className='cardButtons'>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-[1.5em] 2xl:w-[35%]">
                Remove
              </button>
              <button className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-[1.5em] 2xl:w-[35%]">
                Edit
              </button>
            </div>
          </div>
        </div>
        {loadingState &&
          <LoadingScreen message={"Changing Ad status."} />
        }
    </div>
  )
}
