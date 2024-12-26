"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import Rating from "@mui/material/Rating";

const Page = () => {
  const [userData, setUserData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [providerServices, setProviderServices] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const uId = localStorage.getItem("uId");
        const spId = localStorage.getItem("spId");

        // Fetch user and profile data
        const [userResponse, profileResponse, providerServicesResponse] =
          await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${uId}`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/providerpro/user/${uId}`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/proserv/provider/${spId}`
            ),
          ]);

        setUserData(userResponse.data);
        setProfileData(profileResponse.data);
        setProviderServices(providerServicesResponse.data);

        // Fetch detailed services data from services table
        const serviceRequests = providerServicesResponse.data.map((service) =>
          axios
            .get(
              `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/services/${service.service_id}`
            )
            .then((res) => res.data)
            .catch((err) => {
              console.error(
                "Failed to fetch service details for a service:",
                err
              );
              return null;
            })
        );

        const detailedServices = await Promise.all(serviceRequests);

        // Filter out failed requests and update state
        setServiceDetails(
          detailedServices.filter((service) => service !== null)
        );
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchProviderData();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 p-6 bg-white shadow-lg fixed w-full z-20">
        <button className="text-gray-600 hover:text-gray-900">
          <span className="text-2xl">&lt;</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Provider Details</h1>
      </div>

      <div className="pt-24 bg-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Provider Details Card */}
          <div className="bg-white shadow rounded-2xl p-6">
            <div className="flex flex-col items-center mb-5">
              <Image
                src="/assets/images/def_pro.webp"
                alt="Provider Avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
              <h2 className="text-lg font-semibold text-gray-800 flex mt-3">
                {userData.name}
                <div className="relative flex ">
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
              <p className="text-sm text-gray-500">
                {profileData.business_name}
              </p>
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
            <hr />

            {/* About Section */}
            <div className="mt-6 mb-5">
              <h3 className="text-sm font-semibold text-gray-700">About</h3>
              <p className="text-sm text-gray-600 mt-3 mb-8">
                {profileData.about}
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-6 bg-gray-100 p-7 rounded-xl">
              <p className="text-sm font-semibold text-gray-700">Email</p>
              <p className="text-sm text-gray-600">{userData.email}</p>

              <p className="text-sm font-semibold text-gray-700 mt-4">Number</p>
              <p className="text-sm text-gray-600">{userData.mobile}</p>

              <p className="text-sm font-semibold text-gray-700 mt-4">
                Member Since
              </p>
              <p className="text-sm text-gray-600">
                {profileData.created_at
                  ? dayjs(profileData.created_at).format("YYYY-MM-DD")
                  : "Invalid date"}
              </p>
            </div>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl text-gray-800 mb-6 pb-2 ml-10">Services</h2>
            <div className="grid grid-cols-1 gap-8 ml-10 mr-10">
              {serviceDetails.map((service) => (
                <div
                  key={`${service.service_id}`}
                  className="relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src="/assets/images/home_repair.webp"
                      alt="service_image"
                      className="h-52 w-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-100 text-blue-600 text-xs font-semibold uppercase px-3 py-1 rounded-full">
                      {service.name}
                    </div>
                    <div className="bg-white p-1 z-10 absolute bottom-2 right-10 rounded-full translate-y-7">
                      <div className=" bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg ">
                        ₹{service.base_price}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className=" text-yellow-500">
                        <Rating
                          name="half-rating-read"
                          defaultValue={4.5}
                          precision={0.5}
                          readOnly
                          className="text-lg"
                        />
                      </span>
                      <p className="text-sm text-gray-800">4.5</p>
                    </div>
                    <div className="flex items-center">
                      <Image
                        src="/assets/images/def_pro.webp"
                        alt="Provider Avatar"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <p className="text-sm text-gray-600 ml-5">
                        {userData.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
