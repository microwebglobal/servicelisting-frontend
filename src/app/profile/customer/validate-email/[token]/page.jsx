"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { profileAPI } from "@api/profile";
import { Button } from "@components/ui/button";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";

const Page = ({ params }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [tokenData, setTokenData] = useState({
    user_id: "",
    name: "",
    isValid: true,
    user_type: "",
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
          user_id: decodedToken.uid,
          name: decodedToken.name,
          isValid: decodedToken.isValid,
          user_type: decodedToken.user_type,
        });
      } catch (error) {
        setError(
          "Invalid registration link. Please check your email for the correct link."
        );
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  console.log(tokenData);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await profileAPI.getProfileByUserId(tokenData.user_id);
        console.log(response);

        if (response.data) {
          if (response.data.email_verified) {
            setError("Email Already Verified please log in to your account!");
          }
        }
      } catch (error) {
        console.error;
      }
    };

    fetchUser();
  }, [tokenData.user_id]);

  const verifyEmail = async () => {
    try {
      await profileAPI.validateEmail(tokenData.user_id);
      toast({
        title: "Success!",
        description: "Your Email Successfully Validated!",
        variant: "default",
      });
      setTimeout(() => {
        if (tokenData.user_type === "customer") {
          router.push("/profile/customer");
        } else {
          router.push("/profile/provider");
        }
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error Validating Email",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center p-6">
            <h1 className="text-2xl font-bold">Email Verification</h1>
            <p className="mt-2 text-sm">
              Hi {tokenData.name}, let's verify your email!
            </p>
          </div>

          {tokenData.isValid && (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                Click the button below to complete your email verification
                process.
              </p>
              <Button
                onClick={verifyEmail}
                className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm font-medium shadow-md transition-all"
              >
                Verify Email
              </Button>
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-4 mt-4 rounded-md mx-6">
              {error}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
