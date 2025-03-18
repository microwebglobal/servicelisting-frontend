import React from "react";

const ServiceCard = ({ name, description, icon }) => {
  return (
    <div className="w-full sm:w-48 md:w-32 lg:w-48 min-h-48 sm:min-h-56 md:min-h-60 lg:min-h-64 bg-transparent cursor-pointer group rounded-3xl perspective-1000 p-1">
      {/* Card Container */}
      <div className="relative w-full h-full transform-style-preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
        {/* Front Side */}
        <div className="absolute inset-0 bg-black rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl backface-hidden overflow-hidden">
          {icon && (
            <img
              src={process.env.NEXT_PUBLIC_API_ENDPOINT + icon}
              alt={`${name} Icon`}
              className="absolute inset-0 w-full h-full object-cover rounded-3xl"
              crossOrigin="anonymous"
            />
          )}

          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>

          <div className="relative z-10 mt-auto w-full text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-white text-center">
              {name}
            </h3>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 text-white space-y-3 sm:space-y-4 md:space-y-5 rotate-y-180 backface-hidden shadow-2xl overflow-hidden">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-center truncate">
            Coming <br />
            Soon
          </h3>

          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
