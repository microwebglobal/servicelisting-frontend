import React from "react";
import Rating from "@mui/material/Rating";
import Image from "next/image";

const ServiceProviderSideBar = ({ profileData }) => {
  console.log(profileData);
  return (
    <div className="bg-white shadow rounded-2xl p-6 w-64 h-screen flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-5">
        <Image
          src="/assets/images/def_pro.webp"
          alt="Provider Avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
        <h2 className="text-lg font-semibold text-gray-800 flex mt-3">
          {profileData?.business_name || profileData?.User?.name}
          <div className="relative flex">
            <span className="ml-3 mt-1.5">
              <Image
                src="/assets/images/verify_badge.png"
                alt="Verified Badge"
                width={15}
                height={15}
                className="cursor-pointer"
              />
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-2 text-black text-xs font-medium px-2 py-1 rounded shadow-lg opacity-0 transition-opacity duration-300 hover:opacity-100">
                Verified Service Provider
              </div>
            </span>
          </div>
        </h2>
        <p className="text-sm text-gray-500">{profileData?.business_type}</p>
        <div className="flex items-center gap-1 mt-2">
          <Rating
            name="half-rating-read"
            defaultValue={4.5}
            precision={0.5}
            readOnly
          />
          <p className="text-lg font-medium text-gray-800 ml-2">4.5</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className=" bg-gray-100 p-4 rounded-xl">
        <p className="text-sm font-semibold text-gray-700">Email</p>
        <p className="text-sm text-gray-600">{profileData?.User?.email}</p>

        <p className="text-sm font-semibold text-gray-700 mt-4">Number</p>
        <p className="text-sm text-gray-600">{profileData?.User?.mobile}</p>

        <p className="text-sm font-semibold text-gray-700 mt-4">Member Since</p>
        <p className="text-sm text-gray-600">{profileData?.User?.created_at}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow mt-6">
        <ul className="space-y-4">
          <li>
            <a
              href="/services"
              className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-500 transition-colors"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="/orders"
              className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-500 transition-colors"
            >
              Orders
            </a>
          </li>
          <li>
            <a
              href="/employees"
              className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-500 transition-colors"
            >
              Settings
            </a>
          </li>
          {profileData?.business_type === "business" && (
            <li>
              <a
                href="/settings"
                className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-500 transition-colors"
              >
                Employees
              </a>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default ServiceProviderSideBar;
