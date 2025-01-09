"use client";
import React, { useState, useEffect } from "react";
import Footer from "@components/Footer";
import Image from "next/image";
import Navbar from "@components/Navbar";
import { jwtDecode } from "jwt-decode";
import IndividualRegistrationForm from "@components/forms/registrationForms/IndividualRegistrationForm";
import { providerAPI } from "@api/provider";

const Page = ({ params }) => {
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState({
    enquiry_id: "",
    user_id: "",
    business_type: "",
  });
  const [inquiries, setInquiries] = useState();

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
        setTokenData(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!tokenData.enquiry_id) return;

      try {
        const response = await providerAPI.getEnquiryById(tokenData.enquiry_id);
        setInquiries(response.data);
        console.log("Decoded Token Data:", tokenData);
        console.log("Fetched Inquiries:", response.data);
      } catch (error) {
        console.error("Error fetching inquiries", error);
      }
    };

    fetchInquiries();
  }, [tokenData.enquiry_id]);

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
              layout="responsive"
              className="border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
            />
          </div>
          <div className="flex flex-col justify-center w-1/3">
            {inquiries && (
              <IndividualRegistrationForm previousData={inquiries} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
