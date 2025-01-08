"use client";
import React, { useState } from "react";
import Image from "next/image";
import IndividualProviderInquiryForm from "@components/forms/InquiryForms/IndividualProviderInquiryForm";
import BusinessProviderInquiryForm from "@components/forms/InquiryForms/BusinessProviderInquiryForm";

const ProviderReg = () => {
  const [providerType, setProviderType] = useState("individual");

  const handleProviderTypeChange = (type) => {
    setProviderType(type);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white flex flex-col lg:flex-row gap-28 p-8 rounded-lg shadow-md m-20 w-full">
        <div className="flex justify-center items-center w-1/2">
          <Image
            src="/assets/images/reg_img.png"
            alt="Registration Illustration"
            width={800}
            height={500}
            layout="responsive"
            className="border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
          />
        </div>

        <div className="flex flex-col justify-center w-1/3">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center lg:text-left">
            Register as a Service Provider
          </h1>

          <div className="flex justify-center lg:justify-start gap-4 mb-6">
            <button
              onClick={() => handleProviderTypeChange("individual")}
              className={`px-2 py-1 text-md rounded-lg transition-colors duration-300 ease-in-out ${
                providerType === "individual"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-indigo-400"
              }`}
            >
              Individual Provider
            </button>

            <button
              onClick={() => handleProviderTypeChange("business")}
              className={`px-2 py-1 text-md rounded-lg transition-colors duration-300 ease-in-out ${
                providerType === "business"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-indigo-400"
              }`}
            >
              Business Provider
            </button>
          </div>

          <div className="w-full">
            {providerType === "individual" && <IndividualProviderInquiryForm />}
            {providerType === "business" && <BusinessProviderInquiryForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderReg;
