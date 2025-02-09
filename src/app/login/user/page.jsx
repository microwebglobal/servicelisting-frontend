"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoginAPI } from "@/api/login";
import { useAuth } from "@src/context/AuthContext";

const CustomerLogin = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let countdown;
    if (step === 2) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setStep(1);
            setOtp("");
            setError("OTP expired. Please request a new OTP.");
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdown);
      setTimer(120);
    }
    return () => clearInterval(countdown);
  }, [step]);

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await LoginAPI.customerLoginSendOTP(mobile);
      if (response.data.success) {
        setStep(2);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await LoginAPI.customerLoginVerifyOTP(mobile, otp);
      if (response.data.success) {
        login({
          role: "customer",
          uId: response.data.user.id,
        });
        router.push("/profile/customer");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white flex gap-14 p-10 rounded-lg shadow-md pr-20">
        <Image
          src="/assets/images/reg_img.png"
          alt="Customer Login"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
        />

        <div className="ml-14 w-96">
          <h2 className="text-3xl font-semibold text-center mb-2">
            Welcome Back!
          </h2>

          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}

          {step === 1 ? (
            <>
              <p className="text-center mb-8">
                Enter your mobile number to receive OTP
              </p>
              <input
                type="tel"
                className="w-full px-4 py-2 mb-6 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
              />
              <button
                className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                onClick={handleSendOtp}
                disabled={isLoading || mobile.length !== 10}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <p className="text-center mb-8">
                Enter the 6-digit code sent to {mobile}
              </p>
              <input
                type="text"
                className="w-full px-4 py-2 mb-6 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              <p className="text-center text-gray-500 mb-4">
                OTP expires in {Math.floor(timer / 60)}:
                {String(timer % 60).padStart(2, "0")}
              </p>
              <button
                className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                className="w-full mt-4 text-indigo-500 hover:text-indigo-600"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                }}
              >
                Change Mobile Number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
