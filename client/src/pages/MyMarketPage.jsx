import React, { useContext, useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import AuthContext from '../authAndContext/contextApi'
import CategoryToolbar from '../components/CategoryToolbar'
import MyMarketContainer from '../components/MyMarketContainer'

export default function MyProfile() {

  const {fetchedUserListings, setFetchedUserListings, setLoadingState, loadingState, fetchMyPostings, userListings} = useContext(AuthContext)
  
  useEffect(() => {
    if (!fetchedUserListings) {
      setFetchedUserListings(!fetchedUserListings)
      setLoadingState(true)
      fetchMyPostings()
    }
  },[])


  return (
      <MyMarketContainer title="Your Listings">
        <CategoryToolbar getFunc={fetchMyPostings}/>
        <div className='space-y-3'>
          {userListings.map((elem, index) => (
            <ListingCard listingInfo={elem} key={index}/>
          ))}
        </div>
      </MyMarketContainer>
  )
}
