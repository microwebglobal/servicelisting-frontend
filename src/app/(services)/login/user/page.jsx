"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoginAPI } from "@/api/login";
import { useAuth } from "@src/context/AuthContext";
import { InputOtp } from "@heroui/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { FaWhatsapp } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CustomerLogin = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120);
  const [selectedMethod, setSelectedMethod] = useState("mobile");
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

      const response = await LoginAPI.customerLoginSendOTP(
        mobile,
        selectedMethod
      );
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
    setIsLoading(true);
    setError("");

    try {
      const response = await LoginAPI.customerLoginVerifyOTP(mobile, otp);

      if (response.data.success) {
        login({
          role: "customer",
          uId: response.data.user.id,
        });

        router.push("/services");
        setTimeout(() => {
          window.location.reload();
        }, 100);

        return;
      }

      setError("Invalid OTP");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white flex flex-col lg:flex-row gap-8 p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-5xl">
        {/* Image Section */}
        <div className="flex justify-center w-full lg:w-1/2">
          <Image
            src="/assets/images/become-provider.jpg"
            alt="Coming Soon"
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover w-full max-w-sm sm:max-w-md lg:max-w-none"
          />
        </div>

        <div className="lg:ml-12 flex flex-col w-full lg:w-2/5">
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
                className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={12}
              />

              <div className="mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-full justify-start bg-gray-100 text-gray-600"
                    >
                      {selectedMethod === "mobile" ? (
                        <>
                          <MessageCircle className="w-4 h-4 text-purple-500" />
                          Send via SMS
                        </>
                      ) : (
                        <>
                          <FaWhatsapp className="w-4 h-4 text-green-500" />
                          Send to WhatsApp
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => setSelectedMethod("mobile")}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-purple-500" />
                      SMS
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setSelectedMethod("whatsapp")}
                      className="flex items-center gap-2"
                    >
                      <FaWhatsapp className="w-4 h-4 text-green-500" />
                      WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <button
                className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                onClick={handleSendOtp}
                disabled={
                  isLoading || !(mobile.length === 10 || mobile.length === 12)
                }
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <p className="mb-8">Enter the 6-digit code sent to {mobile}</p>

              <div className="flex justify-center mb-4">
                <InputOtp
                  length={6}
                  value={otp}
                  onValueChange={setOtp}
                  variant="faded"
                />
              </div>

              <p className="text-gray-500 mb-4">
                OTP expires in {Math.floor(timer / 60)}:
                {String(timer % 60).padStart(2, "0")}
              </p>

              <button
                type="button"
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
                  setValue("");
                  setError("");
                }}
              >
                Change Mobile Number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
