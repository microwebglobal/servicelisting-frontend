import React from "react";

const ServiceCard = () => {
  return (
    <div className="w-full sm:w-48 md:w-32 lg:w-48 h-48 sm:h-56 md:h-60 lg:h-64 bg-transparent cursor-pointer group rounded-3xl perspective-[1000px] p-1">
      {/* Card Container */}
      <div className="relative w-full h-full transform-style-preserve-3d duration-500 group-hover:rotate-y-180 rounded-3xl shadow-2xl">
        {/* Front Side */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 backface-hidden rounded-3xl overflow-hidden flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl">
          <div className="mt-auto">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
              Service Name
            </h3>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 rotate-y-180 bg-slate-100 bg-opacity-95 rounded-3xl overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10 text-neutral-700 space-y-3 sm:space-y-4 md:space-y-5 backface-hidden">
          <div className="flex flex-col space-y-2">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Service
            </span>
          </div>
          <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-5">
            <span className="text-sm sm:text-base md:text-lg text-gray-700">
              Additional information about the service.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
