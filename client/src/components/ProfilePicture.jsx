import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../authAndContext/contextApi";
import noImage from '../assets/noAvatar.jpg'

export default function ProfilePicture() {
  const [url, setURL] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) setURL(user.avatar_url);
    else setURL(null);
  }, [user]);

  if (url) {
    return (
      <img
        src={`${url}`}
        className="w-8 h-8 md:w-7 md:h-7 rounded-full ring-2 ring-orange-600/60 shadow-lg shrink-0 object-cover object-center"
        alt="profile"
      ></img>
    );
  } else {
    return (
      <img
        src={noImage}
        className="h-6 w-6 rounded-full ring-2 ring-yellow-600/60 shadow-lg shrink-0 object-cover object-center"
        alt="profile"
      ></img>
    );
  }
}
