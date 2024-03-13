import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import AdCard from "../components/AdCard";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Adpage() {
  const location = useLocation();
  const passed = location.state || {};
  const [dbData, setData] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      async function fetchAds() {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_API_URL}/ad`,
            { params: { id: slug } }
          );
          setData(response.data[0]);
        } catch (error) {
          console.error("Error fetching ads:", error);
        }
      }
      fetchAds();
    }
  }, [slug]);

 
  return (
    <div>
      {/* <p>Nav Paramater: {slug}</p>
      <p>Passed Data: {JSON.stringify(passed)}</p>
      <p>DB Data: {JSON.stringify(dbData)}</p>{" "} */}
      <Navbar />
      <AdCard adData={dbData} />
    </div>
  );
}
