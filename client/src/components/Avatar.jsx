import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../authAndContext/contextApi";
import noImage from '../assets/noAvatar.jpg'
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Avatar({ userID, size, square = false}) {
  const [url, setURL] = useState('');
  const { fetchAvatar } = useContext(AuthContext);

  useEffect(() => {
    if (userID) {
      fetchAvatar(userID).then((res) => setURL(res));
    }
  }, [userID, fetchAvatar]);


  const className = square
    ? `${size ? `h-${size} w-${size}` : 'h-48 w-48'} rounded-lg shadow-lg shrink-0 object-cover object-center`
    : `${size ? `h-${size} w-${size}` : 'h-40 w-40'} rounded-full ring-2 ring-yellow-600/60 shadow-lg shrink-0 object-cover object-center`;

  const imageSrc = url && url !== 'error' ? url : noImage;

  return <LazyLoadImage
  className={className}
  src={imageSrc}
  alt={noImage}
  effect='blur'
  placeholderSrc={noImage} />;
}
