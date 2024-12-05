"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [step, setStep] = useState(1); // Step 1: Enter mobile, Step 2: Verify OTP
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login/send-otp",
        { mobile }
      );
      if (response.data.success) {
        alert("OTP sent successfully.");
        setStep(2);
      } else {
        alert("Failed to send OTP. Please try again.");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login/verify-otp",
        {
          mobile,
          otp,
        }
      );
      if (response.data.success) {
        const { token } = response.data;
        localStorage.setItem("authToken", token);
        alert("Login successful!");
        console.log(token); //test logger
        console.log(response.data.role);
        if (response.data.role === "customer") {
          router.push("/profile/customer");
        } else if (response.data.role === "service_provider") {
          router.push("/profile/provider");
        }
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Enter Mobile Number
            </h2>
            <input
              type="text"
              className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Verify OTP
            </h2>
            <input
              type="text"
              className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
