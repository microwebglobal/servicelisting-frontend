"use client";
import React, { useState } from "react";
import axios from "axios";

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
      console.log(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Verify OTP
        </h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-20"
        />
        <button
          onClick={handleVerify}
          className="w-full px-4 py-2 font-semibold text-white bg-black rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-10"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
