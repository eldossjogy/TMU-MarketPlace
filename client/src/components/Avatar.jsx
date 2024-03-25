import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../authAndContext/contextApi";

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

  if (url) {
    return (
      <img
        src={`${url}`}
        className="h-6 w-6 rounded-full ring-2 ring-yellow-600/60 shadow-lg shrink-0 object-cover object-center"
        alt="profile"
      ></img>
    );
  } else {
    return <></>;
  }
}
