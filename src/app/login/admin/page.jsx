"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginAPI } from "@/api/login";
import { useAuth } from "@src/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await LoginAPI.adminLogin(email, password);
      if (response.data.success) {
        console.log(response.data);
        login({
          email: response.data.user.email,
          role: "admin",
        });

        router.push("/admin");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isLoading && <LoadingScreen message={"Logging...."} />}

      <div className="bg-white flex gap-14 p-10 rounded-lg shadow-md pr-20">
        <Image
          src="/assets/images/reg_img.png"
          alt="Admin Login"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
        />

        <div className="ml-14 w-96">
          <h2 className="text-3xl font-semibold text-center mb-2">
            Admin Login
          </h2>
          <p className="text-center mb-8">
            Enter your credentials to access admin panel
          </p>

          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}

          <div className="relative mb-6">
            <input
              type="email"
              className="w-full px-4 py-2 pr-10 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="absolute right-4 top-3 text-gray-500" />
          </div>

          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 pr-10 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute right-4 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
