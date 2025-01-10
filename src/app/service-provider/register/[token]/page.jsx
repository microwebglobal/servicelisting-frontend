"use client";
import React, { useState, useEffect } from "react";
import Footer from "@components/Footer";
import Image from "next/image";
import Navbar from "@components/Navbar";
import { jwtDecode } from "jwt-decode";
import IndividualRegistrationForm from "@components/forms/registrationForms/IndividualRegistrationForm";
import BusinessRegistrationForm from "@components/forms/registrationForms/BusinessRegistrationForm";
import { providerAPI } from "@api/provider";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Page = ({ params }) => {
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState({
    enquiry_id: "",
    user_id: "",
    business_type: "",
  });
  const [inquiries, setInquiries] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
          enquiry_id: decodedToken.eid,
          user_id: decodedToken.uid,
          business_type: decodedToken.t === 'b' ? 'business' : 'individual'
        });
      } catch (error) {
        setError("Invalid registration link. Please check your email for the correct link.");
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!tokenData.enquiry_id) return;

      try {
        setLoading(true);
        const response = await providerAPI.getEnquiryById(tokenData.enquiry_id);
        
        if (response.data) {
          // Check enquiry status
          if (response.data.status === 'completed') {
            setError("This registration has already been completed. Please contact support if you need assistance.");
            setInquiries(null);
          } else if (new Date() > new Date(response.data.registration_link_expires)) {
            setError("This registration link has expired. Please request a new one.");
            setInquiries(null);
          } else {
            setInquiries(response.data);
            setError(null);
          }
        }
      } catch (error) {
        console.error("Error fetching inquiries", error);
        setError("Unable to load registration details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [tokenData.enquiry_id]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Registration Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!inquiries) return null;

    switch (tokenData.business_type) {
      case 'business':
        return <BusinessRegistrationForm previousData={inquiries} />;
      case 'individual':
        return <IndividualRegistrationForm previousData={inquiries} />;
      default:
        return (
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTitle>Invalid Business Type</AlertTitle>
            <AlertDescription>
              Please check your registration link.
            </AlertDescription>
          </Alert>
        );
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
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;