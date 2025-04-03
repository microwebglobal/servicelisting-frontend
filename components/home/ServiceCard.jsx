import React from "react";

const ServiceCard = ({ name, description, icon }) => {
  return (
    <div className="w-full mx-auto bg-transparent group perspective-1000 p-1">
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 gap-4 backface-hidden overflow-hidden">
        <div className="h-64 max-w-64 aspect-square overflow-hidden rounded-xl">
          {icon && (
            <img
              src={process.env.NEXT_PUBLIC_API_ENDPOINT + icon}
              alt={`${name} Icon`}
              className="w-full h-full object-cover rounded-xl shadow-md hover:scale-110 transition-transform duration-300"
              crossOrigin="anonymous"
            />
          )}
        </div>

        <div className="relative z-10 w-full text-center">
          <h3 className="text-xl font-semibold text-center">{name}</h3>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
