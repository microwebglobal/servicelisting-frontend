import React from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import { cn } from "@/lib/utils";

const FeaturedCard = ({
  className,
  imageSrc,
  badgeText,
  price,
  title,
  description,
  rating,
  providerAvatar,
  providerName,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300",
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt="card_image"
          className="h-22 w-full object-cover"
        />
        {badgeText && (
          <div className="absolute top-2 left-2 bg-blue-100 text-blue-600 text-xs font-semibold uppercase px-3 py-1 rounded-full">
            {badgeText}
          </div>
        )}
        {price && (
          <div className="bg-white p-1 z-10 absolute bottom-2 right-2 rounded-full translate-y-7">
            <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              ₹{price}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-lg text-gray-600 mb-4 line-clamp-2">{description}</p>
        {rating && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-yellow-500">
              <Rating
                name="half-rating-read"
                value={rating}
                precision={0.5}
                readOnly
                className="text-lg"
              />
            </span>
            <p className="text-sm text-gray-800">{rating}</p>
          </div>
        )}
        {providerAvatar && providerName && (
          <div className="flex items-center">
            <Image
              src={providerAvatar}
              alt="Provider Avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
            <p className="text-sm text-gray-600 ml-5">{providerName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCard;
