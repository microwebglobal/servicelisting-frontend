"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import UserProfileMenu from "./UserProfile";
import { SiMqtt } from "react-icons/si";

const Navbar = () => {
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
      window.location.reload(); // Refresh the page after logout
    }, 2000);
  };

  const getUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    return userInfo ? userInfo : null;
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = getUserInfo();
      setIsLoggedInState(!!userInfo);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => setIsMobileMenuOpen(false);
    router.events?.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <nav className="bg-gradient-to-b from-[#5f60b9] to-[#6f71c9] text-white h-16 lg:h-20 py-4 px-6 md:px-10 fixed w-full z-20 flex justify-center">
      {/* Container */}
      <div className="flex items-center justify-between w-full max-w-7xl">
        <div className="flex items-center gap-10">
          {/* Logo (Left Side) */}
          <div className="font-bold text-xl md:text-3xl -mt-1">
            <Link href="/" className="flex items-center gap-2.5">
              <SiMqtt />
              QProz
              {/* <div className="relative w-14 h-14">
                <Image
                  src="/assets/images/brand-logo.jpg"
                  alt="QProz Logo"
                  fill
                />
              </div> */}
            </Link>
          </div>

          {/* Navigation Links (Centered) */}
          <div className="hidden md:flex items-center gap-6">
            {["Home", "About", "Services", "Contact"].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="font-semibold"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Authentication / Registration Buttons (Right Side) */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/registration/provider"
              className="text-white border-2 border-white px-4 py-1 rounded-lg font-semibold"
            >
              Register as Professional
            </Link>
          </motion.div>

          {!isLoggedInState ? (
            <Link href="/login/user">
              <button className="bg-white text-indigo-500 px-3 py-1 rounded-lg font-semibold">
                Login
              </button>
            </Link>
          ) : (
            <UserProfileMenu user={getUserInfo()} onLogout={handleLogout} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#5f60b9] text-white absolute top-14 left-0 w-full shadow-lg p-5 flex flex-col gap-4"
          >
            {["Home", "About", "Services", "Contact"].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="block py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/registration/provider"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white border-2 border-white px-4 py-1 my-2 rounded-lg font-semibold"
              >
                Register as Professional
              </Link>
            </motion.div>
            {!isLoggedInState ? (
              <Link href="/login/user">
                <button className="bg-white text-indigo-500 px-3 py-1 my-2 rounded-lg font-semibold">
                  Login
                </button>
              </Link>
            ) : (
              <UserProfileMenu user={getUserInfo()} onLogout={handleLogout} />
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
