"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className="bg-primary text-white p-2 m-2 px-8 flex justify-between rounded-lg items-center"
      style={{ backgroundColor: "#5f60b9" }}
    >
      <input
        type="text"
        placeholder="Search"
        className="p-1 px-4 w-1/3 rounded-md text-gray-700"
      />

      <div
        className="relative p-2"
        onMouseEnter={() => setShowLogout(true)}
        onMouseLeave={() => setShowLogout(false)}
      >
        <div className="rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center cursor-pointer"></div>

        {showLogout && (
          <div
            className="absolute top-12 right-0 bg-gray-800 text-white p-2 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
