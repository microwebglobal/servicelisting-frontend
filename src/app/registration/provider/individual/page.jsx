"use client";
import { useState } from "react";
import axios from "axios";
import OTPVerification from "@components/CustomerReg";
import { useRouter } from "next/navigation";

const IndividualRegister = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
    business_type: "individual",
    business_name: null,
    reg_number: null,
    gst_number: null,
    about: "",
  });

  // Handle user registration form submit
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const { pw, re_pw, ...userData } = userDetails;

    if (pw !== re_pw) {
      alert("password dosen't match");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/send-otp`,
        {
          mobile: userDetails.mobile,
        }
      );

      setStep(2); // Go to OTP verification step
    } catch (err) {
      setError("An error occurred during registration.");
    }
  };

  // Handle OTP verification after sending OTP
  const handleVerification = async (otp) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
        ...userDetails,
        otp,
      });
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
        `${process.env.NEXT_PUBLIC_API_URL}/providerpro/`,
        providerProfile
      );

      alert("profile created");
      router.push("/profile/provider");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-10">
      {/* Rest of the JSX remains the same */}
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

export default IndividualRegister;