import React, { useContext, useState, useEffect } from "react";
import VerticalCard from "../components/VerticalCard";
import Navbar from "../components/Navbar"
import { useLocation, Link } from "react-router-dom";
import AdvertisementCard from "../components/AdvertisementCard";
import StarRating from "../components/StarRating";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import AdContext from "../authAndContext/adProvider";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import toast from "react-hot-toast";


export default function AdvertisementPages() {
    const { fetchAdPage, fetch3ListingsForAdPage } = useContext(AdContext);
    const location = useLocation();
    const [dbData, setData] = useState(null);
    const { slug } = useParams();
    const [nextAd, setNextAd] = useState(null)
    const [previousAd, setPreviousAd] = useState(null)
    const [similarAds, setSimilarAds] = useState({})
    const [localLoading, setLocalLoading] = useState(true)
    //const [currentAdIndex, setCurrentAdIndex] = useState(0);


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

        /*
        if(similarAds.length > 1){

            const { previousElement, nextElement } = findNextAndPrevious(similarAds, parseInt(slug));
            setNextAd(nextElement)
            setPreviousAd(previousElement)
        }
        */
    }, [slug]);

    async function fetchRequiredata(slug) {
        try {
            const res = await fetchAdPage(slug);
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

            <main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 h-[100vh] overflow-show">
                
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