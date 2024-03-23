import React, { useContext, useEffect, useState } from 'react'
import MyListingCard from '../components/MyListingCard'
import AuthContext from '../authAndContext/contextApi'
import CategoryComponent from '../components/CategoryComponent'
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
      <MyMarketContainer>
        <CategoryComponent />
        <div className='space-y-3'>
          {userListings.map((elem, index) => (
            <MyListingCard listingInfo={elem} key={index}/>
          ))}
        </div>
      </MyMarketContainer>
  )
}
