"use client";
import React, { useState, useEffect } from "react";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

const page = ({ params }) => {
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState({
    uid: "",
    name: "",
  });

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
              Set Service Provider Account Password To Compleate Your Profile
            </p>
            <div className="flex-col w-96">
              <form>
                <div className="mb-7 ">
                  <input
                    type="text"
                    placeholder="Password"
                    required
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-7 ">
                  <input
                    type="text"
                    placeholder="Re-Password"
                    required
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
