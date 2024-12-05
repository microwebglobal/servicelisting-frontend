"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import OTPVerification from "@components/OtpVerify";
import { useRouter } from "next/navigation";

const CustomerReg = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    user_name: "",
    email: "",
    mobile: "",
    photo: "path/to/photo.jpg",
    pw: "",
    re_pw: "",
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/otp/send-otp",
        {
          mobile: formData.mobile,
        }
      );
      console.log(response); //logger for debugging
      setStep(2);
    } catch (err) {
      alert("Error sending OTP.");
      console.log(formData); //logger for debugging
    }
  };

  const handleVerification = async () => {
    try {
      await axios.post("http://localhost:8080/api/users/", formData);
      router.push("/profile/customer");
    } catch (err) {
      alert("Registration failed.");
    }
  };

  if (step === 2) {
    return (
      <OTPVerification mobile={formData.mobile} onVerify={handleVerification} />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Customer Registration
        </h2>
        <div className="flex-col">
          <div className="mb-5">
            <label className="font-bold">Full Name:</label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="font-bold">User Name:</label>
            <input
              type="text"
              placeholder="User Name"
              value={formData.user_name}
              onChange={(e) =>
                setFormData({ ...formData, user_name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="font-bold">Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="font-bold">Mobile No:</label>
            <input
              type="text"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="font-bold">Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={formData.pw}
              onChange={(e) => setFormData({ ...formData, pw: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="font-bold">Re-Password:</label>
            <input
              type="password"
              placeholder="Re-Password"
              value={formData.re_pw}
              onChange={(e) =>
                setFormData({ ...formData, re_pw: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-black text-white font-semibold rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
          <Link href="" className="">
            Already have an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerReg;
