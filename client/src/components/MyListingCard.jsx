import React from 'react'
import ImageCarousel from './ImageCarousel'
import Logo from "../assets/logo.png"

export default function MyListingCard({listingInfo}) {
//<ImageCarousel images={images} hovered={true} setHovered={true} vertical={false}/>
  const images = [
    {file_path: "https://jjcsqjjvzatkopidmaha.supabase.co/storage/v1/object/public/ad-listings/b5101797-6e9b-4e03-bb85-3bc4b691ba2f_1710113536417.png"},
    {file_path: "https://jjcsqjjvzatkopidmaha.supabase.co/storage/v1/object/public/ad-listings/b5101797-6e9b-4e03-bb85-3bc4b691ba2f_1710194898784.png"}
  ]

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

  return (
    <div className='myListingCardContainer'>
        <div className='cardImageContainer'>
          <img src={listingInfo.image[0].file_path}></img>
        </div>
        <div className='listingInfoContainer'>
          <div className='cardLeftSection'>
            <h1 className='font-bold text-[2em]'>{truncateString(listingInfo.title, 20)}</h1>
            <div className='flex justify-between'>
              <h3 className='text-green-500 font-bold text-[1.3em]'>{listingInfo.price}</h3>
              <div className="h-auto line-clamp-1 sm:line-clamp-none text-[1.3em]">📍{listingInfo.location}</div>
            </div>
            <p className='mt-2 text-[1.2em]'>{truncateString(listingInfo.description, 100)} </p>
          </div>
          <div className='cardRightSection'>
            <div className='flex md:flex-col md:items-end sm:justify-end'>
              <p className=''>{listingInfo.status.type}</p>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-[1.5em]">
                Repost
              </button>
            </div>
            <div className='w-full flex md:justify-around sm:justify-center gap-1'>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-[1.5em] lgd:w-[40%]">
                Remove
              </button>
              <button class="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-[1.5em] lg:w-[40%]">
                Edit
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}
