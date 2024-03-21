import React from "react";
import ImageCarousel from "./ImageCarousel";
import noImage from '../assets/noImage.png'

export default function CardImages({ image, hovered, setHovered, vertical = true }) {
  if (image.length === 0) {
    return (
      <img
        className="rounded-md w-full h-auto object-cover  aspect-square"
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
      <img
        className="rounded-md w-full h-auto object-cover  aspect-square"
        src={image[0].file_path}
        alt="img"
      ></img>
    );
  }
}
