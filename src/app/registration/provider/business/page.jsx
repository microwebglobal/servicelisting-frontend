"use client";
import { useState } from "react";
import axios from "axios";
import OTPVerification from "@components/CustomerReg";
import { useRouter } from "next/navigation";

const BusinessRegister = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // Track the current step
  const [userDetails, setUserDetails] = useState({
    name: "",
    user_name: "",
    email: "",
    mobile: "",
    photo: "path/to/photo.jpg",
    pw: "",
    re_pw: "",
    role: "service_provider",
  });
  const [providerProfile, setProviderProfile] = useState({
    u_id: "",
    business_type: "business",
    business_name: "",
    reg_number: "",
    gst_number: "",
    about: "",
  });

  // Handle user registration form submit
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const { pw, re_pw, ...userData } = userDetails;

    if (pw !== re_pw) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/otp/send-otp",
        {
          mobile: userDetails.mobile,
        }
      );

      setStep(2); // Go to OTP verification step
    } catch (err) {
      console.log(err);
    }
  };

  // Handle OTP verification after sending OTP
  const handleVerification = async (otp) => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/", {
        ...userDetails,
        otp,
      });
      console.log(response);
      localStorage.setItem("uId", response.data.u_id);
      setProviderProfile({ ...providerProfile, u_id: response.data.u_id });
      setStep(3); // After successful verification, move to the next step
    } catch (err) {
      alert("Registration failed.");
    }
  };

  // Handle profile form submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/providerpro/",
        providerProfile
      );

      alert("profile created");
      router.push("/profile/provider");
    } catch (err) {
      setError("An error occurred during profile creation.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Register as a Service Provider
      </h1>

      {step === 1 && (
        <form
          onSubmit={handleUserSubmit}
          className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Step 1: Basic Details
          </h2>
          <div className="mb-4">
            <input
              name="name"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <input
              name="user_name"
              placeholder="User Name"
              value={userDetails.user_name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, user_name: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Mobile Number"
              value={userDetails.mobile}
              onChange={(e) =>
                setUserDetails({ ...userDetails, mobile: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <input
              name="pw"
              type="password"
              placeholder="Password"
              value={userDetails.pw}
              onChange={(e) =>
                setUserDetails({ ...userDetails, pw: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <input
              name="re_pw"
              type="password"
              placeholder="Confirm Password"
              value={userDetails.re_pw}
              onChange={(e) =>
                setUserDetails({ ...userDetails, re_pw: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Next
          </button>
        </form>
      )}

      {step === 2 && (
        <OTPVerification
          mobile={userDetails.mobile}
          onVerify={handleVerification}
        />
      )}

      {step === 3 && (
        <form
          onSubmit={handleProfileSubmit}
          className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Step 3: Service Provider Profile
          </h2>
          <div className="mb-6">
            <input
              name="business_name"
              type="text"
              placeholder="Business Name"
              value={providerProfile.business_name}
              onChange={(e) =>
                setProviderProfile({
                  ...providerProfile,
                  business_name: e.target.value,
                })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <input
              name="reg_number"
              type="text"
              placeholder="REG Number"
              value={providerProfile.reg_number}
              onChange={(e) =>
                setProviderProfile({
                  ...providerProfile,
                  reg_number: e.target.value,
                })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <input
              name="gst_number"
              type="text"
              placeholder="GST Number"
              value={providerProfile.gst_number}
              onChange={(e) =>
                setProviderProfile({
                  ...providerProfile,
                  gst_number: e.target.value,
                })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <textarea
              name="about"
              placeholder="About your business"
              value={providerProfile.about}
              onChange={(e) =>
                setProviderProfile({
                  ...providerProfile,
                  about: e.target.value,
                })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Finish
          </button>
        </form>
      )}
    </div>
  );
};

export default BusinessRegister;
