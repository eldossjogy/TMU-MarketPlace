import React from "react";
import ImageCarousel from "./ImageCarousel";
import noImage from '../assets/noImage.png'

export default function CardImages({ image, hovered, setHovered, vertical = true, maxWidthSet = 'max-w-32 lg:max-w-60' }) {
  if (image.length === 0) {
    return (
      <img
        className={`rounded-md w-full h-auto object-cover aspect-square ${vertical ? '' : maxWidthSet} m-[0.219rem]`}
        src={noImage}
        alt="img"
      ></img>
    );
  }

  if (image.length > 1) {
    return (
      <ImageCarousel images={image} hovered={hovered} setHovered={setHovered} vertical={vertical}/>
    )
  } else {
    return (
      <ImageCarousel images={image} hovered={hovered} setHovered={setHovered} vertical={vertical}/>
    );
  }
}
