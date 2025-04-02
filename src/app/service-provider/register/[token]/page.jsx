"use client";
import React, { useState, useEffect } from "react";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { jwtDecode } from "jwt-decode";
import IndividualRegistrationForm from "@components/forms/registrationForms/IndividualRegistrationForm";
import BusinessRegistrationForm from "@components/forms/registrationForms/BusinessRegistrationForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { providerAPI } from "@api/provider";

const Page = ({ params }) => {
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState({
    enquiry_id: "",
    user_id: "",
    business_type: "",
  });

  const [inquiries, setInquiries] = useState();
  const [rejectedFields, setRejectedFields] = useState([]);
  const [previousRegData, setPreviousRegData] = useState({});

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
    // Function to fetch previous registration details
    const fetchPreviousRegistration = async (rejected_fields) => {
      try {
        const response = await providerAPI.getProviderByToken(token);
        if (response.data) {
          const nonRejectedFields = Object.keys(response.data).filter(
            (key) => !rejected_fields.includes(key)
          );

          const filteredData = nonRejectedFields.reduce((acc, key) => {
            acc[key] = response.data[key];
            return acc;
          }, {});

          setPreviousRegData(filteredData);
        }
      } catch (error) {
        console.error("Error fetching previous registration", error);
        setError(
          "Unable to load previous registration details. Please try again later."
        );
      }
    };

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setTokenData({
          enquiry_id: decodedToken.eid,
          user_id: decodedToken.uid,
          business_type: decodedToken.t === "b" ? "business" : "individual",
        });

        setRejectedFields(decodedToken.rf);

        if (decodedToken.rf) fetchPreviousRegistration(decodedToken.rf);
      } catch (error) {
        setError(
          "Invalid registration link. Please check your email for the correct link."
        );
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
          if (response.data.status === "completed") {
            setError(
              "This registration has already been completed. Please contact support if you need assistance."
            );
            setInquiries(null);
          } else if (
            new Date() > new Date(response.data.registration_link_expires)
          ) {
            setError(
              "This registration link has expired. Please request a new one."
            );
            setInquiries(null);
          } else {
            setInquiries(response.data);
            setError(null);
          }
        }
      } catch (error) {
        console.error("Error fetching inquiries", error);
        setError(
          "Unable to load registration details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [tokenData.enquiry_id]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
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
      case "business":
        return (
          <BusinessRegistrationForm
            enquiryData={inquiries}
            rejectedFields={rejectedFields}
            previousRegData={previousRegData}
          />
        );
      case "individual":
        return (
          <IndividualRegistrationForm
            enquiryData={inquiries}
            rejectedFields={rejectedFields}
            previousRegData={previousRegData}
          />
        );
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt-12 flex-1 bg-gray-50 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative">
              <div
                className="absolute inset-0 bg-cover bg-center backdrop-blur-2xl"
                style={{
                  backgroundImage: "url('/assets/images/become-provider.jpg')",
                }}
              ></div>
            </div>
            {/* Form Section */}
            <div className="lg:w-1/2 p-3 lg:p-8 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Complete Your Registration
              </h1>
              {rejectedFields?.length > 0 && (
                <p className="text-red-500 mb-4 border border-red-500 bg-red-500/5 p-3 rounded-lg">
                  *You are re-registering as a{" "}
                  {tokenData.business_type === "business"
                    ? "business"
                    : "individual"}
                  . Please fill out only the empty fields to complete the
                  registration process.
                </p>
              )}

              <div className="space-y-6">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
