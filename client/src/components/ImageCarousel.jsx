import React, { useEffect, useState } from 'react';
import {LazyLoadImage} from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';
import placeholderImage from "../assets/imageLoading.png"
import noImage from '../assets/noImage.png'

export default function ImageCarousel({ images, hovered, setHovered, vertical = true }) {
  const [currImage, setImage] = useState(images[0].file_path);
  const [currPos, setPos] = useState(0);
  useEffect(() => {
    setImage(images[currPos].file_path);
  }, [currPos,images]);

  useEffect(() => {
    let interval;
    if (hovered) {
      interval = setInterval(autoScroll, 2500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [hovered]);

  function autoScroll() {
    setPos((prevPos) => {
      const nextPos = prevPos === images.length - 1 ? 0 : prevPos + 1;
      return nextPos;
    });
  }

  return (
    <div className={`${vertical ? 'w-full' : ''} relative`}>
      <LazyLoadImage
        className={`rounded-md object-cover aspect-square h-auto ${vertical ? 'w-full' : 'w-full max-w-32 lg:max-w-60'}`}
        src={currImage}
        alt={noImage}
        effect='blur'
        width='100%'
        height='100%'
        placeholderSrc={placeholderImage} />
      <div className={`text-center mt-2 absolute w-full bottom-0 ${hovered ? 'visible' : 'invisible'}`}>
        {images.length > 1 && images.map((ele, index) => (
          <button
            className={`cursor-pointer h-3 w-3 mx-0.5 rounded-full inline-block transition-colors duration-600 ease-in-out ${index === currPos ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setPos(index)}
            key={index}
          ></button>
        ))}
      </div>
    </div>
  );
}