import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import AdvertisementCard from "../components/AdvertisementCard";
import AdContext from "../authAndContext/adProvider";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";


export default function AdvertisementPages() {
    const { fetchAdPage, fetch3ListingsForAdPage } = useContext(AdContext);
    const [dbData, setData] = useState(null);
    const { slug } = useParams();
    const [nextAd, setNextAd] = useState(null)
    const [previousAd, setPreviousAd] = useState(null)
    const [similarAds, setSimilarAds] = useState({})
    const [localLoading, setLocalLoading] = useState(true)
    //const [currentAdIndex, setCurrentAdIndex] = useState(0);

    const navigate = useNavigate()

    function findNextAndPrevious(arr, element) {
        let nextElement = null;
        let previousElement = null;
    
        // Find the index of the element in the array
        const index = arr.indexOf(element);
    
        if (index !== -1) {
            // Use modulus operator to make the array behave like a circular list
            nextElement = arr[(index + 1) % arr.length];
            previousElement = arr[(index - 1 + arr.length) % arr.length]; // Add arr.length before modulo to handle negative indices
        }
    
        return { previousElement, nextElement };
    }
    
    useEffect(() => {
        if (slug) {
           fetchRequiredata(slug)
        }
    }, [slug]);

    async function fetchRequiredata(slug) {
        try {
            const res = await fetchAdPage(slug);
            if (!res) navigate('/error')
            setData(res);
    
            try {
              const res2 = await fetch3ListingsForAdPage(res.profile.id);
              setSimilarAds(res2);
            } catch (error) {
              toast.success("Ad Fetched")
            }
          } catch (error) {
            toast.error('Error fetching ad page:')
          }
          setLocalLoading(false)
          
    }

    return (
        !localLoading ?
        <>
            <Navbar />

            <main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap p-3 pt-6 min-h-[100vh] gap-3 md:gap-6 overflow-show">
                
                {/*similarAds.length > 1 ? 
                <Link to={{ pathname: `/ad/${previousAd}` }} state={similarAds}>
                    <ChevronLeftIcon className="relative right-2 size-36 top-28" ></ChevronLeftIcon>
                </Link>
    : <></>*/}

                <AdvertisementCard
                    dbData = {dbData}
                    similarAds={similarAds}
                />
                {/*similarAds.length > 1 ? 
                <Link to={{ pathname: `/ad/${nextAd}` }} state={similarAds}>
                    <ChevronRightIcon className="relative left-2 size-36 top-28" ></ChevronRightIcon>
                </Link> 
: <></>*/}

            </main>

        </>
        :
        <LoadingScreen message={"Loading Ad Data"}/>
    );
}