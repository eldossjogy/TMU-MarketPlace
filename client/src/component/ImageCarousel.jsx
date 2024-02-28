import React, { useEffect, useState } from 'react';

export default function ImageCarousel({ images, hovered, setHovered }) {
  const [currImage, setImage] = useState(images[0]);
  const [currPos, setPos] = useState(0);
  useEffect(() => {
    setImage(images[currPos]);
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
    <div
      id="slide-carousel"
      className="w-full relative"
    >
      <img
        className="rounded-md w-full h-auto object-cover aspect-square"
        src={currImage}
        alt="img"
      ></img>
      <div className={`text-center mt-2 absolute w-full bottom-0 ${hovered ? 'visible' : 'invisible'}`}>
        {images.map((ele, index) => (
          <button
            className={`cursor-pointer h-4 w-4 mx-0.5 rounded-full inline-block transition-colors duration-600 ease-in-out ${index === currPos ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setPos(index)}
            key={index}
          ></button>
        ))}
      </div>
    </div>
  );
}
