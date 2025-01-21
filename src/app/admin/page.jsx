"use client";
import { usePathname } from "next/navigation";
import Header from "@components/admin/Header";
import Overview from "@components/admin/Overview";
import Sidebar from "@components/admin/Sidebar";
import withAuth from "@components/isAuth";

import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <Overview />
    </div>
  );
};

export default AdminDashboard;
