"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Modal from "react-modal";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuth();
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
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
    setConfirmLogout(false);

    setTimeout(() => {
      router.push("/");
      window.location.reload(); // Refresh the page after logout
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
    setIsMobileMenuOpen(false);
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
    <>
      <nav
        className="bg-primary py-4 px-6 md:px-10 fixed w-full z-20 flex items-center justify-between"
        style={{ backgroundColor: "#5f60b9" }}
      >
        {/* Logo (Left Side) */}
        <div className="font-bold text-lg text-white">
          <Link href="/">QProz</Link>
        </div>

        {/* Navigation Links (Centered) */}
        <div className="hidden md:flex items-center gap-6 flex-grow justify-center absolute w-full -ml-16">
          {["Home", "About", "Services", "Contact"].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-white font-semibold"
              >
                {item}
              </Link>
            </motion.div>
          ))}
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
                  onClick={() => setConfirmLogout(true)}
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
                    onClick={() => setConfirmLogout(true)}
                  >
                    Logout
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={confirmLogout}
        onRequestClose={() => setConfirmLogout(false)}
        ariaHideApp={false}
        className="m-10 bg-white p-6 rounded-lg shadow-xl w-96 max-w-lg"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-sm z-50"
      >
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            Are you sure you want to log out?
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={handleLogout}
            >
              Yes, Logout
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg w-full"
              onClick={() => setConfirmLogout(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
