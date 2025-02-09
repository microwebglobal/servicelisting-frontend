"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const CustomerSidebar = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const uId = localStorage.getItem("uId");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${uId}`
      );
      setUserData(response.data);
      console.log(response.data);
    };
    fetchUserData();
  }, []);

  return (
    <aside className="w-full md:w-1/4 bg-white p-4 border-r">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <Image
            src="/assets/images/def_pro.webp"
            alt="John Doe"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <h2 className="text-xl font-bold">{userData.name}</h2>
        <p className="text-black bg-yellow-400 p-1 rounded-2xl w-40 text-sm mx-auto">
          Premium Plus User
        </p>
      </div>
      <hr className="mt-5" />
      <div className="mt-5">
        <h3 className="text-lg bg-slate-300 rounded-lg px-4 py-1 font-semibold mb-2">
          Your Information
        </h3>
        <ul className="space-y-4 ml-5">
          <li className="flex flex-col">
            <span className="font-bold">Name</span>
            <span>{userData.name}</span>
          </li>
          <li className="flex flex-col">
            <span className="font-bold">Email</span>
            <span>{userData.email}</span>
          </li>
          <li className="flex flex-col">
            <span className="font-bold">Contact Number</span>
            <span>{userData.mobile}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-bold">Locations</span>
            <span>&gt;</span>
          </li>
        </ul>

        <div className="mt-8">
          <h3 className="text-lg bg-slate-300 rounded-lg px-4 py-1 font-semibold mb-2">
            General
          </h3>
          <ul className="space-y-4 ml-5">
            <li className="justify-between flex">
              <span>App Language</span>
              <span>&gt;</span>
            </li>
            <li className="justify-between flex">
              <span>Notifications</span>
              <span>&gt;</span>
            </li>
            <li className="justify-between flex">
              <span>Support</span>
              <span>&gt;</span>
            </li>
            <li className="justify-between flex">
              <span>Rate Us</span>
              <span>&gt;</span>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-lg bg-slate-300 rounded-lg px-4 py-1 font-semibold mb-2">
            About App
          </h3>
          <ul className="space-y-4 ml-5">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>About</li>
          </ul>
        </div>

        <button className="w-full bg-red-500 text-white py-2 mt-6 rounded-md">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default CustomerSidebar;