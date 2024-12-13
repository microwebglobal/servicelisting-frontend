"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

const OTPVerification = ({ mobile, onVerify }) => {
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/otp/verify-otp",
        {
          mobile: mobile,
          otp: otp,
        }
      );
      console.log(response.data.success);

      if (response.data.success == true) {
        const { token } = response.data;
        localStorage.setItem("authToken", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("User Info:", payload);
        onVerify();
      } else {
        alert("Invalid OTP.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Enter OTP</h2>
      <p className="text-center mb-5">Enter 4 Digit Code Sent to Your Phone</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-10"
      />
      <button
        onClick={handleVerify}
        className="w-full px-4 py-2 font-semibold text-white bg-black rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-8 mb-5"
      >
        Verify
      </button>
      <Link href="/login" className="text-center mx-auto">
        Already have an account{" "}
        <span className="text-indigo-700 ">sign in</span>
      </Link>
      <div className="mt-10 flex items-center">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-4 text-gray-600">Or Continue With</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>
    </div>
  );
};

export default OTPVerification;
