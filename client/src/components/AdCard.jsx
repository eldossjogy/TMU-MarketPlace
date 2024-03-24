import React from "react";
import Loading from "./Loading";
import Avatar from "./Avatar";
import CardImages from "./CardImages"
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
        <CardImages image={adData.image}/>
        <h1>{adData.title}</h1>
        <h2 className="text-green-600 font-bold text-lg">
          ${adData.price.toLocaleString()}
        </h2>
        <h6>{adData.location}</h6>
        <p>{adData.description}</p>
        <div className="flex">
          <h1 className="mr-3">Posted by {adData.profile.name}</h1>
          <Avatar userID={adData.profile.id} />
        </div>
        <h1>Posted at {adData.post_time}</h1>
      </div>
    </div>
  );
}
