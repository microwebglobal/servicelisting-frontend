import React from "react";
import Link from "next/link";
import IndividualProviderInquiryForm from "@components/forms/InquiryForms/IndividualProviderInquiryForm";
import BusinessProviderInquiryForm from "@components/forms/InquiryForms/BusinessProviderInquiryForm";

const Registration = () => {
  return (
    <div className="flex gap-4">
      {/* <Link
        href="/registration/customer"
        className="w-full max-w-xs px-6 py-3 text-center font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Register As Customer
      </Link>
      <Link
        href="/registration/provider"
        className="w-full max-w-xs px-6 py-3 text-center font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Register As Service Provider
      </Link>
      <Link
        href="/login"
        className="w-full max-w-xs px-6 py-3 text-center font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Login
      </Link> */}

      {/* <IndividualProviderInquiryForm /> */}
      {/* <BusinessProviderInquiryForm /> */}
    </div>
  );
};

export default Registration;
