import React, { useContext, useState, useEffect } from "react";
import VerticalCard from "../components/VerticalCard";
import Navbar from "../components/Navbar"
import { useLocation } from "react-router-dom";
import AdvertisementCard from "../components/AdvertisementCard";
import StarRating from "../components/StarRating";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import AdContext from "../authAndContext/adProvider";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";


export default function AdvertisementPages() {
    const { fetchAdPage } = useContext(AdContext);
    const location = useLocation();
    const [dbData, setData] = useState(null);
    const { slug } = useParams();

    useEffect( () => {
        if (slug) {
            fetchAdPage(slug).then((res) => {setData(res)})
        }
    }, [slug]);

    function previousAd() {
        alert("You scrolled left!");
    }

    function nextAd() {
        alert("You scrolled right!");
    }

    if (dbData === null) {
        <Navbar />
        return <Loading/>
    }

    if (dbData === false || dbData === undefined) {
        <div>
            <Navbar />
            <h1>This ad is currently not available</h1>
        </div>
    }

    return (
        <>
            <Navbar />

            <main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 h-[100vh] overflow-show">

                <ChevronLeftIcon className="relative right-2 size-36 top-28" onClick={previousAd}></ChevronLeftIcon>

                <AdvertisementCard
                image={dbData.image}
                title={dbData.title}
                price={dbData.price}
                location={dbData.location}
                description={dbData.description}
                userimg={dbData.profile.id}
                sellername={dbData.profile.name}
                />

                <ChevronRightIcon className="relative left-2 size-36 top-28" onClick={nextAd}></ChevronRightIcon>
            </main>

        </>
    );
}
