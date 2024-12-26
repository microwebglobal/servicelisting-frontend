"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = () => {
    router.push("/admin");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white flex gap-14 p-10 rounded-lg shadow-md pr-20">
        <Image
          src="/assets/images/reg_img.png"
          alt="John Doe"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
        />
        <div className="ml-14 mt-4" style={{ width: "350px" }}>
          <h2 className="text-3xl font-semibold text-center mb-2">
            Welcome Admin!
          </h2>
          <p className="text-center mb-14">
            Enter Below Credentials To Sign In
          </p>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 mb-10 pr-10 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
            />
            <FaUser className="absolute right-4 inset-y-3 transform text-gray-500" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 mb-10 pr-10 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
            <div
              className="absolute right-4 inset-y-3 transform text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5 mt-5"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
