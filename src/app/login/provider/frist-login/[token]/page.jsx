"use client";
import React, { useState, useEffect } from "react";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { providerAPI } from "@api/provider";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";

const page = ({ params }) => {
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState({
    uid: "",
    name: "",
  });

  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.token) {
        setToken(resolvedParams.token);
      }
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setTokenData({
          uid: decodedToken.uid,
          name: decodedToken.name,
        });
      } catch (error) {
        setError(
          "Invalid registration link. Please check your email for the correct link."
        );
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const handleSetPassword = async () => {
    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      await providerAPI.setProviderPassword(
        {
          password: password,
          token: token,
        },
        tokenData.uid
      );

      toast({
        title: "Password Set Successfully!",
        description: "Please Login To Your Account.",
        variant: "default",
      });

      setTimeout(() => {
        router.push("/login/service-provider");
      }, 3000);

      setIsLoading(false);
    } catch (error) {
      setError("Failed to set password. Please try again.");
      console.error("Error setting password:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white flex flex-col lg:flex-row gap-28 p-8 rounded-lg shadow-md m-20 w-full">
          <div className="flex justify-center items-center w-1/2">
            <Image
              src="/assets/images/reg_img.png"
              alt="Registration Illustration"
              width={800}
              height={500}
              className="border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
            />
          </div>
          <div className="flex flex-col justify-center w-1/3">
            <h2 className="text-3xl font-semibold text-center mb-1">
              Hi' Welcome {tokenData.name}!
            </h2>
            <p className="text-center mb-14">
              Set Service Provider Account Password To Complete Your Profile
            </p>
            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 pr-10 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute right-4 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\S]{8,}$/.test(
                password
              ) &&
                password && (
                  <p className="text-red-500 text-xs mt-1">
                    Password must be at least 8 characters long, include an
                    uppercase letter, a lowercase letter, a special character,
                    and no spaces.
                  </p>
                )}
            </div>

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 pr-10 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Re-Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
              {rePassword && password !== rePassword && (
                <p className="text-red-500 text-xs mt-1">
                  Password and Re-Password should match.
                </p>
              )}
            </div>

            <button
              className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
              disabled={
                isLoading || password.length < 8 || password !== rePassword
              }
              onClick={handleSetPassword}
            >
              {isLoading ? "Setting Password..." : "Set Password"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
