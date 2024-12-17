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
    email: "",
    mobile: "",
    photo: "path/to/photo.jpg",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white flex gap-14 p-10 rounded-3xl shadow-md">
        <Image
          src="/assets/images/reg_img.png"
          alt="John Doe"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-6"
        />
        {step === 2 && (
          <div>
            <OTPVerification
              mobile={formData.mobile}
              onVerify={handleVerification}
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <SetLocation />
          </div>
        )}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold text-center mb-1">
              Let's Set You Up!
            </h2>
            <p className="text-center mb-14">Sign up To Continue</p>
            <div className="flex-col w-96">
              <form onSubmit={handleSubmit}>
                <div className="mb-7 ">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-7">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                    formData.email && (
                      <p className="text-red-500 text-xs mt-1">
                        Please enter a valid email address.
                      </p>
                    )}
                </div>
                <div className="mb-10">
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {!/^[0-9]{10}$/.test(formData.mobile) && formData.mobile && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid phone no.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5 mt-4"
                >
                  Register
                </button>
              </form>
              <div className="flex justify-center items-center">
                <Link
                  href="/login"
                  className="text-center mx-auto align-middle"
                >
                  Already have an account{" "}
                  <span className="text-indigo-700">sign in</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReg;

//AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc
