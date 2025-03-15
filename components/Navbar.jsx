"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

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
      className="bg-primary py-4 px-6 md:px-10 fixed w-full z-20 flex justify-between items-center"
      style={{ backgroundColor: "#5f60b9" }}
    >
      {/* Logo (Left Side) */}
      <div className="font-bold text-lg text-white">
        <Link href="/">QProz</Link>
      </div>

      {/* Navigation Links (Centered) */}
      <div className="hidden md:flex items-center gap-6 flex-grow justify-center">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className=" text-white font-semibold">
            Home
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/about" className=" text-white font-semibold">
            About
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/services" className=" text-white font-semibold">
            Services
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/contact" className=" text-white font-semibold">
            Contact
          </Link>
        </motion.div>
      </div>

      {/* Authentication / Registration Buttons (Right Side) */}
      <div className="hidden md:flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/registration/provider"
            className=" text-white border-2 border-white px-4 py-1 rounded-2xl font-semibold"
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute top-12 right-0 bg-gray-800 text-white p-2 rounded-md cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </motion.div>
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

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-primary text-white absolute top-16 left-0 w-full shadow-lg p-5"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/about"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/services"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/registration/provider"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register as a Professional
            </Link>
          </motion.div>
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
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
