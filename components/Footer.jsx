import { motion } from "framer-motion";
import { BiWorld } from "react-icons/bi";
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-white py-10 px-6 bg-[#5f60b9]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="lg:col-span-1 md:col-span-2"
        >
          <h2 className="text-xl font-bold">[APP LOGO]</h2>
          <p className="text-gray-300 mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            explicabo suscipit sunt fugiat odit quis tempore.
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

        {[
          {
            title: "[App Name] Jobs",
            items: ["Tearms", "Privacy", "Cookies", "Licenses", "Consulting"],
          },
          {
            title: "Quick Links",
            items: ["Home", "About Us", "Services", "Portfolio", "Contact"],
          },
          {
            title: "Legal",
            items: ["Tearms", "Privacy", "Cookies", "Licenses", "Consulting"],
          },
        ].map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 * (index + 1) }}
            className="md:w-full md:col-span-1"
          >
            <h2 className="text-xl font-bold">{section.title}</h2>
            <ul className="mt-4 space-y-2">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="hover:text-green-400 transition duration-300 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Footer Bottom */}
      <motion.div
        className="mt-10 text-gray-400 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        &copy; {new Date().getFullYear()} [Organization] | All rights reserved
      </motion.div>
    </footer>
  );
};

export default Footer;
