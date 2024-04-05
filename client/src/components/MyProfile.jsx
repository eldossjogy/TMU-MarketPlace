import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdContext from "../authAndContext/adProvider";
import Loading from "../components/Loading";
import HorizontalCard from "../components/HorizontalCard";
import AuthContext from "../authAndContext/contextApi";
import SearchContext from "../authAndContext/searchProvider";
import Avatar from "../components/Avatar";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function MyProfile({ forcedUsername }) {
  const [username, setUserName] = useState("");
  const { paramusername } = useParams();
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

  useEffect(() => {
    if (forcedUsername) {
      setUserName(forcedUsername);
    }
    else {
      setUserName(paramusername);
    }
  }, []);

  if (!user) {
    return (
      <div className="m-3 p-3 space-x-3 flex group max-h-40 lg:max-h-72 overflow-hidden">
        <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
            <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">This user does not exist or has been removed.</div>
            <a href="/" className="text-xl text-blue-500">Return home</a>
          </div>
        </div>
      </div>
    );
  }

  if (user == null || categories == null || ads == null) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="flex-shrink-0 md:order-1 md:text-center">
          <Avatar userID={user.id} square={true} />
        </div>
        <div className="flex-grow md:order-2">
            <section className="flex items-center gap-4">
              <div className="font-bold text-2xl">
                {user.name
                  ? `${user.name}`
                  : user.name}
              </div>
              <Link to={'/my-market/edit-profile'} className="w-6 h-6" aria-label="Click to edit profile.">
                <PencilSquareIcon className="w-6 h-6 hover:text-sky-600"/>
              </Link>
            </section>
            <div className="">
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : ''}
            </div>
            <div className="text-sm text-gray-600">
              Joined:{" "}
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {user.bio}
            </div>
          </div>
        </div>
        {ads && ads.length > 0 ? (
          <div>
            <div
              id="title"
              className="flex justify-end lg:justify-end md:justify-end"
            >
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
                  const categoryIds = new Set(
                    ads.map((obj) => obj.category_id)
                  );
                  if (categoryIds.has(element.id)) {
                    return (
                      <button
                        key={element.id}
                        className={`text-sm md:text-base relative flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 font-semibold transition duration-200 group ${selectedCat === element.id ? "bg-amber-300" : ""
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
        ) : (
          <></>
        )}

        <section className="flex flex-col">
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
        </section>
      </div>
    </>
  );
}
