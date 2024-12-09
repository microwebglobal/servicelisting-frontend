"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import OTPVerification from "@components/CustomerReg";
import { useRouter } from "next/navigation";
import SetLocation from "@components/SetLocation";

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
      const response = await axios.post(
        "http://localhost:8080/api/users/",
        formData
      );
      console.log(response.data);
      localStorage.setItem("uId", response.data.u_id);
      setStep(3);
    } catch (err) {
      alert("Registration failed.");
    }
  };

  if (step === 2) {
    return (
      <OTPVerification mobile={formData.mobile} onVerify={handleVerification} />
    );
  } else if (step === 3) {
    return <SetLocation />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white flex gap-14 p-8 rounded-lg shadow-md">
        <Image
          src="/assets/images/reg_img.png"
          alt="John Doe"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
        />
        <div>
          <h2 className="text-2xl font-semibold text-center mb-1">
            Let's Set You Up!
          </h2>
          <p className="text-center mb-6">Sign up To Continue</p>
          <div className="flex-col w-96">
            <div className="mb-5 ">
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
              <input
                type="password"
                placeholder="Password"
                value={formData.pw}
                onChange={(e) =>
                  setFormData({ ...formData, pw: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-5">
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
              className="w-full py-2 bg-black text-white font-semibold rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
            >
              Register
            </button>
            <Link href="/login" className="text-center mx-auto">
              Already have an account{" "}
              <span className="text-indigo-700 ">sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReg;

//AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc
