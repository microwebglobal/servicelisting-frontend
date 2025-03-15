"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@components/Footer";

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 pt-20">
        {/* Hero Section with Background Image */}
        <section
          className="relative bg-cover bg-center text-white text-center py-28 px-6"
          style={{
            backgroundImage: "url('/assets/images/contact-us.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-4xl sm:text-5xl font-extrabold z-10"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative text-lg mt-4 max-w-3xl mx-auto z-10"
          >
            Got a question or need assistance? Reach out to us, and we'll be
            happy to help!
          </motion.p>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-6 md:px-16">
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-center">Get in Touch</h2>
            <p className="text-center text-gray-600 mt-2">
              Fill out the form below, and we'll get back to you as soon as
              possible.
            </p>
            <form className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:shadow-md"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:shadow-md"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:shadow-md"
                required
              />
              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:shadow-md"
                required
              ></textarea>
              <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-md">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="py-16 px-6 md:px-16 bg-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold">Contact Information</h2>
            <p className="text-gray-600 mt-2">
              You can also reach us through these channels:
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <FaPhoneAlt className="text-blue-600 text-3xl mb-2" />
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">+123-456-7890</p>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <FaEnvelope className="text-blue-600 text-3xl mb-2" />
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">contact@yourcompany.com</p>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <FaMapMarkerAlt className="text-blue-600 text-3xl mb-2" />
                <p className="font-semibold">Location</p>
                <p className="text-gray-600">Mumbai, India</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Google Map Section */}
        <section className="py-16 px-6 md:px-16">
          <h2 className="text-3xl font-bold text-center">Our Location</h2>
          <div className="mt-8 w-full h-72 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Company Location"
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.346887615719!2d72.87765571532046!3d19.175043987032967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b91a6d3adad5%3A0x92a1e0e4b73c9d51!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1639983472146!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
