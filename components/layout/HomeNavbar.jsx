"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { SiMqtt } from "react-icons/si";
import { cn } from "@/lib/utils";
import UserProfileMenu from "../layout/UserProfile";
import Image from "next/image";

const HomeNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(false);
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
    <nav
      className={`${
        isScrolled || isMobileMenuOpen
          ? "bg-[#5f60b9] shadow-md"
          : "bg-transparent"
      } fixed top-0 left-0 w-full h-[5rem] z-30 text-white transition-all duration-300 py-6 px-6 md:px-10 flex justify-center`}
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
              <SiMqtt
                className={cn("size-6", { "text-[#5f60b9]": !isScrolled })}
              />
              QProz
              {/* <div className="relative w-28 h-28 -mr-10">
                <Image
                  src="/assets/images/brand-logo.png"
                  alt="QProz Logo"
                  fill
                />
              </div> */}
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
            <UserProfileMenu user={getUserInfo()} onLogout={handleLogout} />
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
              <UserProfileMenu user={getUserInfo()} onLogout={handleLogout} />
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;
