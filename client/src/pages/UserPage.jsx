import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdContext from "../authAndContext/adProvider";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import HorizontalCard from "../components/HorizontalCard";
import AuthContext from "../authAndContext/contextApi";
import SearchContext from "../authAndContext/searchProvider";
import Avatar from "../components/Avatar";

export default function UserPage() {
  const { username } = useParams();
  const { categories } = useContext(AuthContext);
  const { fetchUserAds, fetchUserProfile } = useContext(AdContext);
  const { userSavedIDs } = useContext(SearchContext);
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    if (username) {
      fetchUserProfile(username.toLowerCase()).then((res) => {
        setUser(res);
        if (res) {
          fetchUserAds(res.id).then((res) => {
            setAds(res);
          });
        }
      });
    }
  }, [fetchUserAds, fetchUserProfile, username]);

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

  if (user == null || categories == null || ads == null) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto lg:max-w-[80%] mt-4 ">
        <div className="flex items-start space-x-4 ml-3">
          <Avatar userID={user.id} square={true} />
          <div>
            <div className="font-bold text-lg">{user.first_name && user.last_name ?  `${user.first_name} ${user.last_name}` : user.name}</div>
            <div className="text-sm text-gray-600">
              Joined:{" "}
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
        <div className="pb-4 ">
          <div
            id="title"
            className="flex justify-end lg:justify-end md:justify-end"
          >
            <div className="flex flex-wrap gap-2 p-1.5 bg-[#fafafb] ring-1 ring-gray-200 rounded-2xl">
              {ads && ads.length > 0 ? (
                <button
                  className={`text-sm md:text-base relative flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 font-semibold transition duration-200 group ${
                    selectedCat === null ? "bg-amber-300" : ""
                  }`}
                  onClick={() => {
                    setSelectedCat(null);
                  }}
                >
                  All
                </button>
              ) : (
                <></>
              )}
              {categories?.map((element) => {
                const categoryIds = new Set(ads.map((obj) => obj.category_id));
                if (categoryIds.has(element.id)) {
                  return (
                    <button
                      key={element.id}
                      className={`text-sm md:text-base relative flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 font-semibold transition duration-200 group ${
                        selectedCat === element.id ? "bg-amber-300" : ""
                      }`}
                      onClick={() => {
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

        {ads && ads.length > 0 ? (
          ads.map((ad) => {
            if (selectedCat == null || selectedCat === ad.category_id) {
              return (
                <div className="mb-3" key={ad.id}>
                  <HorizontalCard
                    image={ad.image}
                    title={ad.title}
                    price={ad.price}
                    description={ad.description}
                    status={ad.status}
                    location={ad.location}
                    postID={ad.id}
                    date={ad.post_time}
                    is_saved={userSavedIDs[ad.id] ? true : false}
                    show_saved={false}
                  />
                </div>
              );
            }
          })
        ) : (
          <div className="m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">
            <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
              <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
                <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">
                  No Results
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
