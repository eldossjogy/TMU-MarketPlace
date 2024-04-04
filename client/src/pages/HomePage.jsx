import React, { useContext, useEffect, useState } from "react";
import VerticalCard from "../components/VerticalCard";
import Navbar from "../components/Navbar";
import AdContext from "../authAndContext/adProvider";
import AuthContext from "../authAndContext/contextApi";
import { Link } from "react-router-dom";
import SearchContext from "../authAndContext/searchProvider";

export default function HomePage() {
  const { fetchHomePage } = useContext(AdContext);
  const { categories } = useContext(AuthContext);
  const { userSavedIDs } = useContext(SearchContext);
  const [ads, setAds] = useState(null);

  useEffect(() => {
    fetchHomePage().then((res) => {
      if (res) {
        // updated to remove empty arrays
        Object.entries(res).forEach(([key, value]) => {
          if (value.length === 0) {
            delete res[key];
          }
        });
        setAds(res);
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      {ads &&
        Object.keys(ads).map((key) => (
          <main
            key={key}
            className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap p-3 pt-6"
          >
            <div className="w-full">
              <div className="w-full">
                <h1 className="w-full font-bold text-2xl ml-auto mb-2">
                  {categories.find((item) => item.id === parseInt(key)).name}
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
                {ads &&
                  ads[key].map((element) => (
                    <VerticalCard
                      image={element.image}
                      title={element.title}
                      price={element.price.toLocaleString()}
                      location={element.location}
                      description={element.description}
                      postID={element.id}
                      key={element.id}
                      similarAds={ads[key].map((obj) => obj.id)}
                      is_saved={userSavedIDs[element.id] !== undefined}
                      show_saved={true}
                    />
                  ))}

                <Link
                  to={`/search?category=${key}`}
                  className="hover:cursor-pointer bg-[#fafafb] rounded-lg border-2 shadow-md hover:shadow-lg overflow-hidden flex flex-col items-center justify-center p-4 hover:bg-amber-100 hover:border-none"
                >
                  <div className="text-black text-6xl">→</div>
                  <div className="text-gray-700 text-base mt-2">show more</div>
                </Link>
              </div>
            </div>
          </main>
        ))}
    </>
  );
}
