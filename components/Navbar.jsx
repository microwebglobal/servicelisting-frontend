"use client";
import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuth();
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    toast({
      title: "Logging Out",
      description: "Please log in again to continue.",
      variant: "destructive",
    });
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const getUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    console.log(userInfo);
    return userInfo ? userInfo : null;
  };

  const handleNavigate = () => {
    const userInfo = getUserInfo();
    if (userInfo.role === "customer") {
      router.push("/profile/customer");
    } else if (userInfo.role === "admin") {
      router.push("/admin");
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = getUserInfo();

      if (userInfo) {
        setIsLoggedInState(true);
      } else {
        setIsLoggedInState(false);
      }
    };

    checkLoginStatus(); // Call the function on component mount
  }, []);
  // Empty array ensures this runs once after initial render

  return (
    <nav
      className="bg-primary py-3 px-8 flex justify-between items-center pr-20"
      style={{ height: "80px", backgroundColor: "#5f60b9" }}
    >
      <div className="font-bold text-lg text-white ml-20">[App Logo]</div>
      <div className="flex gap-6">
        <a
          href="/registration/provider"
          className="hover:underline text-white py-1 font-semibold"
        >
          Register as a Professional
        </a>
        {!isLoggedInState ? (
          <>
            <Link href="/login/user">
              <button className="bg-white text-indigo-500 px-3 py-1 rounded-lg font-semibold">
                Login
              </button>
            </Link>
            <Link href="/registration/customer">
              <button className="bg-indigo-500 text-white px-3 py-1 rounded-lg border-2 font-semibold">
                Sign up
              </button>
            </Link>
          </>
        ) : (
          <div
            className="relative p-2"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <div
              className="rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center cursor-pointer"
              onClick={handleNavigate}
            ></div>

            {showLogout && (
              <div
                className="absolute top-12 right-0 bg-gray-800 text-white p-2 rounded-md cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
