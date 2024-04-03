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


export default function AdvertisementPages() {
    const { fetchAdPage } = useContext(AdContext);
    const location = useLocation();
    const [dbData, setData] = useState(null);
    const { slug } = useParams();
    const similarAds = location.state || {};
    const [currentAdIndex, setCurrentAdIndex] = useState(0);


    useEffect(() => {
        if (slug) {
            fetchAdPage(slug).then((res) => { setData(res) });
        }
        setCurrentAdIndex(similarAds.indexOf(parseInt(slug)));
    }, [slug]);

    function previousAd() {
        //alert("You scrolled left!");
        setCurrentAdIndex((prevIndex) => (prevIndex === 0 ? similarAds.length - 1 : prevIndex - 1));
    }

    function nextAd() {
        //alert("You scrolled right!");
        setCurrentAdIndex((prevIndex) => (prevIndex === similarAds.length - 1 ? 0 : prevIndex + 1));

    }

    if (dbData === null) {
        <Navbar />
        return <Loading />
    }

    if (dbData === false || dbData === undefined) {
        return (
            <div>
                <Navbar />
                <div className="flex justify-center items-center my-3 mx-3">
                    <div className="bg-card p-3 rounded-lg w-full max-w-7xl shadow-md text-center">
                        <h1 className="text-xl">
                            This listing does not exist or has been removed.
                        </h1>
                        <a href="/" className="text-xl text-blue-500">
                            Return home
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Navbar />

            <main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 h-[100vh] overflow-show">

                <Link to={{ pathname: `/ads/${similarAds[currentAdIndex]}` }} state={similarAds}>
                    <ChevronLeftIcon className="relative right-2 size-36 top-28" onClick={()=>{previousAd()}}></ChevronLeftIcon>
                </Link>

                <AdvertisementCard
                    image={dbData.image}
                    title={dbData.title}
                    price={dbData.price}
                    location={dbData.location}
                    description={dbData.description}
                    userimg={dbData.profile.id}
                    sellername={dbData.profile.name}
                />

                <Link to={{ pathname: `/ads/${similarAds[currentAdIndex]}` }} state={similarAds}>
                    <ChevronRightIcon className="relative left-2 size-36 top-28" onClick={()=>{nextAd()}}></ChevronRightIcon>
                </Link>

            </main>

        </>
    );
}
