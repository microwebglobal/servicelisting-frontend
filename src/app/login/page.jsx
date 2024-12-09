"use client";
import axios from "axios";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
        console.log(response.data.uId);
        localStorage.setItem("uId", response.data.uId);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white flex gap-14 p-8 rounded-lg shadow-md w-3/4">
        <Image
          src="/assets/images/reg_img.png"
          alt="John Doe"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
        />
        <div>
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-semibold text-center mb-2">
                Welcome Back
              </h2>
              <p className="text-center mb-14">
                Enter Your Contact Number to Sign in
              </p>
              <input
                type="text"
                className="w-full p-3 mb-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <button
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
              <Link href="/login" className="text-center mx-auto">
                Already have an account{" "}
                <span className="text-indigo-700 ">sign in</span>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4">
                Enter OTP
              </h2>
              <p className="text-center mb-14">
                Enter 4 Digit Code Sent to Your Phone
              </p>
              <input
                type="text"
                className="w-full p-3 mb-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
              <Link href="/login" className="text-center mx-auto">
                Already have an account{" "}
                <span className="text-indigo-700 ">sign in</span>
              </Link>
            </>
          )}
          <div className="mt-10 flex items-center">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-600">Or Continue With</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
