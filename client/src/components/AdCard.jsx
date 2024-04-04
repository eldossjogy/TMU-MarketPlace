import React from "react";
import Loading from "./Loading";
import Avatar from "./Avatar";
import CardImages from "./CardImages"
<<<<<<< HEAD
import ChatModal from "./ChatModal";
=======
import { Link } from "react-router-dom";

>>>>>>> 4993db47addf86a210eb042f32108c8883ef16a3
export default function AdCard({ adData }) {
  if (adData === null) {
    return <Loading />;
  }

  if (adData === false || adData === undefined) {
    return (
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
    );
  }

  return (
    <div className="flex justify-center items-center my-3 mx-3">
      <div className="bg-card p-3 rounded-lg w-full max-w-7xl shadow-md">
        <CardImages image={adData.image} />
        <h1>{adData.title}</h1>
        <h2 className="text-green-600 font-bold text-lg">
          ${adData.price.toLocaleString()}
        </h2>
        <h6>{adData.location}</h6>
        <p>{adData.description}</p>
        <Link to={`/u/${adData.profile.name}`}>
          <div className="flex">
            <h1 className="mr-3">Posted by {adData.profile.name}</h1>
            <Avatar userID={adData.profile.id} />
          </div>
        </Link>
        <h1>Posted at {adData.post_time}</h1>
        {/* Shouldn't be able to message on your own ads */}
        <ChatModal recipient_id={adData.profile.id} ad_post={adData.id}/>
      </div>
    </div>
  );
}
