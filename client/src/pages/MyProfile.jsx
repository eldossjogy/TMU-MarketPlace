import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MyProfileContainer from '../components/MyProfileContainer'
import MyListingCard from '../components/MyListingCard'
import AuthContext from '../authAndContext/contextApi'
import LoadingScreen from '../components/LoadingScreen'
import CategoryComponent from '../components/CategoryComponent'

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
    <div>
      <Navbar />
      <MyProfileContainer>
        <div className='myListingsContainer'>
          <CategoryComponent />
          {userListings.map((elem, index) => (
            <MyListingCard listingInfo={elem} key={index}/>
          ))}
        </div>
      </MyProfileContainer>
      {loadingState && <LoadingScreen />}
    </div>
  )
}
