"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Rating from "@mui/material/Rating";
import { providerAPI } from "@api/provider";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, BookCheck, Settings } from "lucide-react";
import { PeopleAltSharp } from "@node_modules/@mui/icons-material";

const ServiceProviderSideBar = ({ onLogout }) => {
  const [profileData, setProfileData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const fetchProviderData = async () => {
      try {
        const response = await providerAPI.getProviderByUserId(user.uId);
        setProfileData(response.data);

        console.log(response.data);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchProviderData();
  }, []);
  return (
    <aside className="bg-white shadow p-6 w-72 h-screen overflow-y-auto">
      {/* Profile Section */}
      <div className="space-y-6">
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

          <p className="text-sm font-semibold text-gray-700 mt-4">
            Member Since
          </p>
          <p className="text-sm text-gray-600">
            {profileData?.User?.created_at}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3 mt-5">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/profile/provider/services")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Service Management
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/profile/provider/orders")}
          >
            <BookCheck className="mr-2 h-4 w-4" />
            Orders
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/profile/provider/employees")}
          >
            <PeopleAltSharp className="mr-2 h-4 w-4" />
            Employees
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/profile/provider/configurations")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configarations
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full mt-10"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default ServiceProviderSideBar;
