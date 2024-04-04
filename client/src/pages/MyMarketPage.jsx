import React, { useContext, useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import AuthContext from '../authAndContext/contextApi'
import CategoryToolbar from '../components/CategoryToolbar'
import MyMarketContainer from '../components/MyMarketContainer'
import Loading from '../components/Loading'

export default function MyProfile() {

  const {fetchedUserListings, setFetchedUserListings, setLoadingState, loadingState, fetchMyPostings, userListings} = useContext(AuthContext)
  useEffect(() => {
    if (!fetchedUserListings) {
      setLoadingState(true)
      setFetchedUserListings(!fetchedUserListings)
      fetchMyPostings();
    }
  },[])

  return (
      <MyMarketContainer title="Your Listings">
        <CategoryToolbar getFunc={(index) => {fetchMyPostings(index); }}/>
        <div className='space-y-3'>
          {loadingState && 
            <Loading message={"Loading Listings..."} />
          }
          {userListings && userListings.length !== 0 && userListings.map((elem, index) => (
            <ListingCard listingInfo={elem} key={index}/>
          ))}
          {(!userListings || (userListings && userListings.length === 0)) && [1].map((key) => (
							<div key={key} className="m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">
								<div className="max-w-xl mx-auto sm:px-6 lg:px-8">
									<div className="flex items-center pt-8 sm:justify-start sm:pt-0">
										<div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">No Results</div>
									</div>
								</div>
							</div>
						))}
        </div>
      </MyMarketContainer>
  )
}
