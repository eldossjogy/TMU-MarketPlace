import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdContext from "../authAndContext/adProvider";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import HorizontalCard from "../components/HorizontalCard";
import AuthContext from "../authAndContext/contextApi";
import SearchContext from "../authAndContext/searchProvider";

export default function UserPage() {
    const { username } = useParams();
    const { categories } = useContext(AuthContext)
    const { fetchUserAds, fetchUserProfile } = useContext(AdContext);
    const {userSavedIDs} = useContext(SearchContext)
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState(null);
    const [selectedCat, setSelectedCat] = useState(null);

    useEffect(() => {
        if (username) {
            fetchUserProfile(username).then((res) => {
                setUser(res)
                fetchUserAds(res.id).then((res) => {
                    setAds(res);
                });
            });
        }
    }, [username]);

    /*  useEffect(() => {
         if (user) {
             fetchUserAds(user.id).then((res) => {
                 setAds(res);
             });
         }
     }, [user]); */

    /*  useEffect(() => {
         console.log(user, categories, ads)
     }, [user,categories,ads]) */

    if (user == null || categories == null || ads == null) {
        return (
            <>
                <Navbar />
                <Loading />
            </>
        );
    }

    if (user == false) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center my-3 mx-3">
                    <div className="bg-card p-3 rounded-lg w-full max-w-7xl shadow-md text-center">
                        <h1 className="text-xl">
                            This user does not exist or has been removed.
                        </h1>
                        <a href="/" className="text-xl text-blue-500">
                            Return home
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto lg:max-w-[90%] mt-4">
                <div className="flex items-start space-x-4 ml-3">
                    <img
                        src={
                            "https://jjcsqjjvzatkopidmaha.supabase.co/storage/v1/object/public/ad-listings/cc15abd2-0849-498a-859d-9666c54daeda_1711485613968.jpg"
                        }
                        alt="user"
                        className="w-48 h-48 rounded-lg"
                    />
                    <div>
                        <div className="font-bold text-lg">{user.name}</div>
                        <div className="text-sm text-gray-600">
                            Joined: April 1, 2036
                        </div>
                        <div className="text-sm text-gray-600">
                            Location: Toronto, ON
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <div id="title" className="flex justify-end lg:justify-end md:justify-end">
                        <div className="flex flex-wrap gap-2 p-1.5 bg-[#fafafb] ring-1 ring-gray-200 rounded-2xl">
                            <button
                                className={`text-sm md:text-base relative flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 font-semibold transition duration-200 group ${selectedCat === null ? "bg-amber-300" : ""
                                    }`}
                                onClick={() => {
                                    setSelectedCat(null);
                                }}
                            >
                                All
                            </button>
                            {categories?.map((element) => {
                                const categoryIds = new Set(ads.map((obj) => obj.category_id));
                                if (categoryIds.has(element.id)) {
                                    return (
                                        <button
                                            key={element.id}
                                            className={`text-sm md:text-base relative flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 font-semibold transition duration-200 group ${selectedCat === element.id ? "bg-amber-300" : ""
                                                }`} onClick={() => {
                                                    setSelectedCat(element.id);
                                                }}
                                        >
                                            {element.name}
                                        </button>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>

                {ads &&
                    ads.map((ad) => {
                        if (selectedCat == null || selectedCat === ad.category_id) {
                            return (
                                <div className="mb-3">
                                    <HorizontalCard
                                        key={ad.id}
                                        image={ad.image}
                                        title={ad.title}
                                        price={ad.price}
                                        description={ad.description}
                                        status={ad.status}
                                        location={ad.location}
                                        postID={ad.id}
                                        date={ad.post_time}
                                        is_saved={userSavedIDs[ad.id] ? true : false}
                                        show_saved={true}
                                    />
                                </div>
                            );
                        }
                    })}
            </div>
        </>
    );
}