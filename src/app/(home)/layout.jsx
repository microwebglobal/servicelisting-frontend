"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeLayout({ children }) {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {children}
      {/* Footer */}
      <Footer />
    </div>
  );
}
