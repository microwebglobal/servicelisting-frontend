import React from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Label } from "./label";

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
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={cn(
        "relative group border rounded-lg overflow-hidden cursor-pointer transition-shadow duration-300 w-[260px] h-[300px] hover:border-purple-800/20 hover:shadow-md",
        className
      )}
    >
      <div className="relative">
        <div className="relative w-[260px] h-[150px] overflow-hidden">
          <Image
            src={imageSrc}
            alt={title || "card image"}
            width={260}
            height={150}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {price && (
          <div className="bg-white p-1 z-10 absolute bottom-2 right-2 rounded-full translate-y-7">
            <div className="bg-muted border text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              ₹ {price}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 h-full bg-muted/50">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
          {description}
        </p>

        {rating && (
          <div className="flex items-center gap-3 mb-6 -ml-1">
            <Rating
              size="small"
              name="half-rating-read"
              value={rating}
              precision={0.5}
              readOnly
            />

            <p className="text-xs text-muted-foreground">
              {`${rating} (${badgeText})`}
            </p>
          </div>
        )}

        {providerAvatar && providerName && (
          <div className="flex items-center absolute bottom-4">
            <Avatar className="w-6 h-6 ring-[#5f60b9]/20 ring-offset-1 ring-2">
              <AvatarImage src={providerAvatar} />
              <AvatarFallback>
                {providerName
                  ? providerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "N/A"}
              </AvatarFallback>
            </Avatar>

            <Label className="text-xs text-muted-foreground ml-3">
              {providerName}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCard;
