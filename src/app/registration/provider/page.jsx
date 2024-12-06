"use client";
import React from "react";
import Link from "next/link";

const ProviderReg = () => {
  return (
    <div className="w-full flex items-center py-10 px-4">
      <Link
        href="/registration/provider/individual"
        className="w-full max-w-xs px-6 py-3 text-center font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Register As Individual Provider
      </Link>
      <Link
        href="/registration/provider/business"
        className="w-full max-w-xs px-6 py-3 text-center font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Register As Business Provider
      </Link>
    </div>
  );
};

export default ProviderReg;
