import React from "react";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

const Footer = () => {
  return (
    <div>
      <footer className="bg-primary text-white py-10 px-12">
        <div className="flex justify-between items-start py-10 px-20">
          <div className="w-1/4">
            <h4 className="font-bold text-lg mb-2">[App Logo]</h4>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Dignissimos, omnis quo. Accusamus quo,
            </p>
            <div className="flex mt-3 gap-4 text-2xl">
              <FaYoutube />
              <FaInstagram />
              <FaFacebook />
              <FaTwitter />
              <IoMdMail />
            </div>
          </div>
          <div className="flex gap-20">
            <div>
              <h5 className="font-bold mb-5">Company</h5>
              <ul className="space-y-2">
                <li>About us</li>
                <li>Services</li>
                <li>Our Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-5">Legal</h5>
              <ul className="space-y-2">
                <li>Terms</li>
                <li>Privacy</li>
                <li>Cookies</li>
                <li>License</li>
              </ul>
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-8 text-center">
          ©2024 [Organization]. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
