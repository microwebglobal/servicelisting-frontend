"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  HomeIcon,
  HelpCircleIcon,
  PlusCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SuccessPage = () => {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gradient-to-b from-blue-100 to-white"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="bg-green-500 text-white p-6 rounded-full shadow-lg"
        >
          <CheckCircleIcon className="w-20 h-20" />
        </motion.div>

        <h2 className="text-4xl font-bold text-gray-800 mt-6">
          Application Submission Successful!
        </h2>

        <p className="text-lg text-gray-600 mt-4 max-w-xl">
          Your inquiry has been submitted successfully. Our team will review it
          and get back to you soon. Thank you for reaching out!
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <motion.button
            onClick={() => router.push("/registration/provider")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Submit Another Inquiry
          </motion.button>

          <motion.button
            onClick={() => router.push("/contact")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            <HelpCircleIcon className="w-5 h-5" />
            Get Help
          </motion.button>

          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </motion.button>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default SuccessPage;
