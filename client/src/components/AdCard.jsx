import React from "react";
import Loading from "./Loading";
import Avatar from "./Avatar";

export default function AdCard({ adData }) {
  if (adData == null) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center my-3 mx-3">
      <div className="bg-card p-3 rounded-lg w-full max-w-7xl shadow-md">
        {adData.image.map((ele, index) => (
          <img key={index} src={ele.file_path} alt="" />
        ))}
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
