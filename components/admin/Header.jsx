"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import Modal from "react-modal";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logging Out",
      description: "Please log in again to continue.",
      variant: "destructive",
    });

    setConfirmLogout(false);

    setTimeout(() => {
      router.push("/login/admin");
      window.location.reload(); // Refresh the page after logout
    }, 2000);
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
            onClick={() => setConfirmLogout(true)}
          >
            Logout
          </div>
        )}
      </div>
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={confirmLogout}
        onRequestClose={() => setConfirmLogout(false)}
        ariaHideApp={false}
        className="m-10 bg-white p-6 rounded-lg shadow-xl w-96 max-w-lg"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-sm"
      >
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            Are you sure you want to log out?
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={handleLogout}
            >
              Yes, Logout
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg w-full"
              onClick={() => setConfirmLogout(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
