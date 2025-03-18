"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SparklesIcon } from "lucide-react";

const ServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="mt-20 flex-grow flex items-center justify-center p-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl my-20 text-center bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-xl"
        >
          {/* Icon */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-full shadow-lg mx-auto mb-6">
            <SparklesIcon className="text-white w-14 h-14" />
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold text-gray-800"
          >
            Coming Soon...
          </motion.h2>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-gray-700 mt-4 text-lg md:text-xl"
          >
            We are working hard to bring you great services! We can't wait to
            unveil something special that will make your experience even better.
            Stay tuned for exciting updates!
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-6 text-lg text-gray-500"
          >
            <p>
              Our team is tirelessly crafting something that will revolutionize
              the way you interact with our services marketplace. With new
              features, better performance, and an enhanced user experience, we
              are excited to bring this to live soon.
            </p>
            <p className="mt-4">
              Thank you for your patience and support. and we are committed to
              making your experience seamless.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicePage;
