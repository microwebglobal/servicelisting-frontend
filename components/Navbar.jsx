"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuth();
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
    return userInfo ? userInfo : null;
  };

  const handleNavigate = () => {
    const userInfo = getUserInfo();
    if (userInfo?.role === "customer") {
      router.push("/profile/customer");
    } else if (userInfo?.role === "admin") {
      router.push("/admin");
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = getUserInfo();
      setIsLoggedInState(!!userInfo);
    };
    checkLoginStatus();
  }, []);

  return (
    <nav
      className="bg-primary py-3 px-6 md:px-10 fixed w-full z-20"
      style={{ backgroundColor: "#5f60b9" }}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="font-bold text-lg text-white">[App Logo]</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/registration/provider"
            className="hover:underline text-white font-semibold"
          >
            Register as a Professional
          </Link>
          {!isLoggedInState ? (
            <>
              <Link href="/login/user">
                <button className="bg-white text-indigo-500 px-3 py-1 rounded-lg font-semibold">
                  Login
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary text-white absolute top-16 left-0 w-full shadow-lg p-5">
          <Link
            href="/registration/provider"
            className="block py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Register as a Professional
          </Link>
          {!isLoggedInState ? (
            <>
              <Link href="/login/user">
                <button className="w-full bg-white text-indigo-500 py-2 mt-2 rounded-lg font-semibold">
                  Login
                </button>
              </Link>
              <Link href="/registration/customer">
                <button className="w-full bg-indigo-500 text-white py-2 mt-2 rounded-lg border-2 font-semibold">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <div className="mt-4">
              <button
                className="w-full bg-gray-800 py-2 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
