import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import AdCard from "../components/AdCard";
import { useParams } from "react-router-dom";
import AdContext from "../authAndContext/adProvider";

export default function Adpage() {
  const { fetchAdPage } = useContext(AdContext);
  const location = useLocation();
  const passed = location.state || {};
  const [dbData, setData] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      fetchAdPage(slug).then((res)=>{setData(res)})
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
