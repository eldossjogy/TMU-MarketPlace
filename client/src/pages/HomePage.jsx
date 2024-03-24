import React, { useContext, useEffect, useState } from "react";
import VerticalCard from "../components/VerticalCard";
import Navbar from "../components/Navbar";
import AdContext from "../authAndContext/adProvider";

export default function HomePage() {
  const { fetchHomePage } = useContext(AdContext);
  const [ads, setAds] = useState(null);

  useEffect(() => {
    fetchHomePage().then((res) => {
      setAds(res);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="mx-auto lg:max-w-[90%] mt-4">
      </div>
      <main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          {ads ? (
            ads.map((element) => (
              <VerticalCard
                image={element.image}
                title={element.title}
                price={element.price.toLocaleString()}
                location={element.location}
                description={element.description}
                postID={element.id}
                key={element.id}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
}
