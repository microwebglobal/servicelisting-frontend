"use client";
import React, { useState } from "react";
import Image from "next/image";
import IndividualProviderInquiryForm from "@components/forms/InquiryForms/IndividualProviderInquiryForm";
import BusinessProviderInquiryForm from "@components/forms/InquiryForms/BusinessProviderInquiryForm";

const ProviderReg = () => {
  const [providerType, setProviderType] = useState("individual");
  const [individualFormData, setIndividualFormData] = useState({
    type: "individual",
    name: "",
    email: "",
    mobile: "",
    gender: "",
    business_type: "individual",
    dob: "",
    years_experience: 0,
    categories: [],
    cities: [],
    location: "",
    skills: "",
  });

  const [businessFormData, setBusinessFormData] = useState({
    type: "business",
    business_name: "",
    name: "", // Authorized Person Name
    mobile: "", // Authorized Person Contact
    email: "",
    gender: "", // Authorized Person Gender
    business_type: "sole_proprietorship",
    website: "",
    location: "",
    categories: [],
    cities: [],
    no_of_employee: "",
  });

  const handleIndividualFormDataChange = (data) => {
    setIndividualFormData(data);
  };

  const handleBusinessFormDataChange = (data) => {
    setBusinessFormData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-28 pb-10">
      <div className="bg-white flex flex-col lg:flex-row gap-10 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-6xl">
        {/* Image Section (Fixed Size) */}
        <div className="flex justify-center items-center w-full lg:w-1/2">
          <div className="relative w-full h-full lg:w-auto">
            <Image
              src="/assets/images/become-provider.jpg"
              alt="Registration Illustration"
              width={600}
              height={900}
              className="rounded-2xl border-opacity-25 object-cover min-h-[400px] lg:min-h-[650px] w-full h-full lg:w-[600px]"
            />
          </div>
        </div>

        {/* Registration Form Section */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 flex-1 min-h-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 text-center lg:text-left">
            Register as a Service Provider
          </h1>

          {/* Toggle Buttons */}
          <div className="flex justify-center lg:justify-start gap-2 sm:gap-4 mb-6">
            <button
              onClick={() => setProviderType("individual")}
              className={`px-3 py-2 text-sm sm:text-md rounded-lg transition-colors duration-300 ${
                providerType === "individual"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-indigo-400"
              }`}
            >
              Individual Provider
            </button>

            <button
              onClick={() => setProviderType("business")}
              className={`px-3 py-2 text-sm sm:text-md rounded-lg transition-colors duration-300 ${
                providerType === "business"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-indigo-400"
              }`}
            >
              Business Provider
            </button>
          </div>

          {/* Form Section (Dynamic Height) */}
          <div className="w-full flex-grow">
            {providerType === "individual" ? (
              <IndividualProviderInquiryForm
                formData={individualFormData}
                onFormDataChange={handleIndividualFormDataChange}
              />
            ) : (
              <BusinessProviderInquiryForm
                formData={businessFormData}
                onFormDataChange={handleBusinessFormDataChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderReg;
