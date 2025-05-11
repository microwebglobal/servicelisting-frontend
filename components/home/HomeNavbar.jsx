"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { SiMqtt } from "react-icons/si";
import Modal from "react-modal";

const HomeNavbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getUserInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "null");
    } catch {
      return null;
    }
  };

  const handleNavigate = () => {
    const user = getUserInfo();
    if (user?.role === "customer") router.push("/profile/customer");
    else if (user?.role === "admin") router.push("/admin");
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    setIsLoggedInState(!!getUserInfo());
  }, []);

  useEffect(() => {
    const closeMenuOnRoute = () => setIsMobileMenuOpen(false);
    router.events?.on("routeChangeComplete", closeMenuOnRoute);
    return () => router.events?.off("routeChangeComplete", closeMenuOnRoute);
  }, [router]);

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
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      <nav
        className={`${
          isScrolled || isMobileMenuOpen
            ? "bg-[#5f60b9]/95 shadow-md"
            : "bg-transparent"
        } fixed top-0 left-0 w-full z-30 text-white transition-all duration-300 py-6 px-6 md:px-10 flex justify-center`}
      >
        {/* Overlay */}
        {!isScrolled && !isMobileMenuOpen && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-0" />
        )}

        <div className="flex items-center justify-between w-full max-w-7xl z-10">
          {/* Left - Logo + Nav Links */}
          <div className="flex items-center gap-10">
            <div className="font-bold text-xl md:text-3xl -mt-1">
              <Link href="/" className="flex items-center gap-2.5">
                <SiMqtt className="size-6" />
                QProz
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {["Home", "About", "Services", "Contact"].map((item) => (
                <motion.div key={item} whileHover={{ scale: 1.1 }}>
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

          <div className="hidden md:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                href="/registration/provider"
                className="border-2 border-white px-4 py-1 rounded-lg font-semibold"
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
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 bg-gray-800 text-white p-2 rounded-md cursor-pointer"
                    onClick={() => setConfirmLogout(true)}
                  >
                    Logout
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-14 left-0 w-full p-5 flex flex-col gap-4 md:hidden bg-[#5f60b9] text-white shadow-lg"
            >
              {["Home", "About", "Services", "Contact"].map((item) => (
                <motion.div key={item} whileHover={{ scale: 1.1 }}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="block py-2 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.1 }}>
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
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={confirmLogout}
        onRequestClose={() => setConfirmLogout(false)}
        ariaHideApp={false}
        className="m-10 bg-white p-6 rounded-lg shadow-xl w-96 max-w-lg"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
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

export default HomeNavbar;
