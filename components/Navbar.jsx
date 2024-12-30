import React from "react";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      className="bg-primary py-3 px-8 flex justify-between items-center pr-20"
      style={{ height: "80px", backgroundColor: "#5f60b9" }}
    >
      <div className="font-bold text-lg text-white ml-20">[App Logo]</div>
      <div className="flex gap-6">
        <a
          href="/registration/provider/business"
          className="hover:underline text-white py-1 font-semibold"
        >
          Register as a Professional
        </a>
        <Link href="/login/user">
          <button className="bg-white text-indigo-500 px-3 py-1 rounded-lg font-semibold">
            Login
          </button>
        </Link>
        <Link href="/registration/customer">
          <button className="bg-indigo-500 text-white px-3 py-1 rounded-lg border-2 font-semibold">
            Sign up
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
