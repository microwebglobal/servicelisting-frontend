"use client";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";

const SuccessComponent = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gradient-to-b from-blue-50 to-white"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="bg-green-500 text-white p-6 rounded-full shadow-lg"
      >
        <CheckCircleIcon className="w-16 h-16" />
      </motion.div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 mt-6">
        🎉 Submission Successful!
      </h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mt-3">
        Your inquiry has been submitted successfully. We will get back to you
        soon. 🚀
      </p>

      {/* Button */}
      <motion.button
        onClick={onReset}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Submit Another Inquiry
      </motion.button>
    </motion.div>
  );
};

export default SuccessComponent;
