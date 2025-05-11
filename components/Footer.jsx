"use client";

import { motion } from "framer-motion";
import { BiWorld } from "react-icons/bi";
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-white pt-10 pb-6 lg:pt-16 lg:pb-12 px-6 bg-[#5f60b9] mt-auto">
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-20 items-start max-w-7xl mx-auto">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:col-span-1"
        >
          <h1 className="text-3xl font-bold">QProz</h1>

          <p className="text-gray-300 mt-4">
            Your trusted partner for seamless and efficient solutions. We
            specialize in delivering high-quality services tailored to your
            needs.
          </p>

          <div className="mt-4 flex gap-4 text-2xl">
            {[FaFacebook, FaLinkedin, FaInstagram, FaTwitter, BiWorld].map(
              (Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Icon />
                </motion.a>
              )
            )}
          </div>
        </motion.div>

        {/* Center & Right Sections */}
        <div className="grid grid-cols-3 gap-8 md:col-span-2">
          {[
            {
              title: "QProz Jobs",
              items: [
                {
                  name: "Become A Provider",
                  url: "/registration/provider",
                },
                { name: "Book Service", url: "/login/user" },
              ],
            },
            {
              title: "Quick Links",
              items: [
                { name: "Home", url: "/" },
                { name: "About Us", url: "/about" },
                { name: "Services", url: "#services-section" },
                { name: "Contact", url: "/contact" },
              ],
            },
            {
              title: "Legal",
              items: [
                { name: "Terms", url: "/terms" },
                { name: "Privacy", url: "/privacy-policy" },
              ],
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 * (index + 1) }}
            >
              <h2 className="text-xl font-bold">{section.title}</h2>
              <ul className="mt-4 space-y-2 text-gray-300">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="hover:text-green-400 transition duration-300 cursor-pointer"
                  >
                    <a href={item.url} rel="noopener noreferrer">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <motion.div
        className="mt-14 text-gray-300 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        &copy; {new Date().getFullYear()} QProz | All rights reserved
      </motion.div>
    </footer>
  );
};

export default Footer;
