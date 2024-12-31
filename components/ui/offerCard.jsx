import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const OfferCard = ({
  cardHeader,
  bodyText,
  imageSrc,
  onClick,
  isButton = false,
  buttonText = "Learn More",
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center p-6 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      )}
      onClick={onClick}
      style={{
        background: "linear-gradient(to right, #4F46E5, #8B5CF6, transparent)",
      }}
    >
      {/* Text Section */}
      <div className="z-10">
        <h3 className="text-xl font-semibold text-white">{cardHeader}</h3>
        <p className="text-sm text-gray-200 mt-2">{bodyText}</p>

        {/* Button Section */}
        {isButton && (
          <button
            className="mt-4 bg-white text-indigo-500 px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition"
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent onClick
              onClick && onClick();
            }}
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Image Section */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={cardHeader}
          fill
          className="object-cover opacity-20"
        />
      </div>
    </div>
  );
};

export default OfferCard;
