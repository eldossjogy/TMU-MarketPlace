import React, { useEffect, useState } from "react";
import VerticalCard from "../components/VerticalCard";
import Navbar from "../components/Navbar";
import axios from "axios";
export default function HomePage() {
  const [ads, setAds] = useState(null);

  useEffect(() => {
    async function fetchAds() {
      const reponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/ad/homepage`
      );
      setAds(reponse.data);
    }
    fetchAds();
  }, []);

  
  return (
    <>
      <Navbar />
      <main className="container m-auto flex flex-wrap md:flex-nowrap mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {ads ? (
            ads.map((element) => (
              <VerticalCard
                image={element.image}
                title={element.title}
                price={element.price.toLocaleString()}
                location={"Toronto, ON"}
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
