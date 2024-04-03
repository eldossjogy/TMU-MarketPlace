import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../authAndContext/contextApi";
import noImage from '../assets/noAvatar.jpg'

export default function Avatar({ userID }) {
  const [url, setURL] = useState("");
  const { fetchAvatar } = useContext(AuthContext);

  useEffect(() => {
    if (userID) {
      fetchAvatar(userID).then((res) => {
        setURL(res);
      });
    }
  }, [userID]);

  if (url && !(url === 'error')) {
    return (
      <img
      src={`${url}`}
      className="h-40 w-40 rounded-full ring-2 ring-yellow-600/60 shadow-lg shrink-0 object-cover object-center"
      alt="profile"
      ></img>
      );
    } else {
      return (
      <img
        src={noImage}
        className="h-40 w-40 rounded-full ring-2 ring-yellow-600/60 shadow-lg shrink-0 object-cover object-center"
        alt="profile"
      ></img>
    );
  }
}
