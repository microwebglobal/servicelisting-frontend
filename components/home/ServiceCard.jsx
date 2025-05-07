import React from "react";

const ServiceCard = ({ name, icon }) => {
  return (
    <div className="w-full mx-auto bg-transparent group perspective-1000 p-1">
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 gap-4 backface-hidden overflow-hidden">
        <div className="relative h-64 max-w-64 aspect-square overflow-hidden rounded-xl">
          {icon && (
            <img
              src={process.env.NEXT_PUBLIC_API_ENDPOINT + icon}
              alt={`${name} Icon`}
              className="w-full h-full object-cover rounded-xl shadow-md"
              crossOrigin="anonymous"
            />
          )}
          {/* Dark overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl" />

          <div className="absolute bottom-2 left-0 right-0 px-2 text-center z-10">
            <h3 className="text-lg font-semibold text-white drop-shadow-md">
              {name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
