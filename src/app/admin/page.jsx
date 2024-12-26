import Header from "@components/admin/Header";
import Overview from "@components/admin/Overview";
import Sidebar from "@components/admin/Sidebar";
import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-col">
          <Header />
          <Overview />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
