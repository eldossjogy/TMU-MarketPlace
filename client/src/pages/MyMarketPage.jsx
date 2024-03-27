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
          {(userListings.map((elem, index) => (
            <ListingCard listingInfo={elem} key={index}/>
          )))}
        </div>
      </MyMarketContainer>
  )
}
