import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MyProfileContainer from '../components/MyProfileContainer'
import AuthContext from '../authAndContext/contextApi'
import LoadingScreen from '../components/LoadingScreen'
import ListingForm from '../components/ListingForm'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

export default function EditListingPage() {

    const {setLoadingState, loadingState, localSession} = useContext(AuthContext)
    const [localLoading, setLocalLoading] = useState(false)
    const [listingInfo, setListingInfo] = useState({})
    const navigate = useNavigate()
    const currentUrl = useLocation()
    const ad_id = currentUrl.pathname.split('/').pop()
  
    useEffect(() => {
        setLocalLoading(true)
        getcurrentListingData()
    },[])

    async function getcurrentListingData() {
        
        try {
            const currentUserListing = await axios.get(
            `${process.env.REACT_APP_BACKEND_API_URL}/my-market/get-my-listing/${ad_id}`,
            {
              headers: {
                Authorization: "Bearer " + localSession.access_token,
              },
            }
          )
          setListingInfo(currentUserListing.data)
          toast.success("User Listing Loaded")
          setLocalLoading(false)
        }
        catch(error) {
            toast.error(error.response.data.errMessage)
            setLocalLoading(false)
            navigate('/my-market')
        }
    }

    return (
        <div>
          <Navbar />
          <MyProfileContainer>
            {localLoading 
            ?  <LoadingScreen message={"Fetching Listing Data"}/> 
            : <ListingForm formDataProp={listingInfo} typeOfReq={'Put'} editingForm={true}/>}
          </MyProfileContainer>
        </div>
    )
}
