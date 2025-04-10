"use client";

import React from "react";
import Header from "@components/admin/Header";
import Sidebar from "@components/admin/Sidebar";
import withAuth from "@components/isAuth";

const layout = ({ children }) => {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
};

export default withAuth(layout, ["admin"]);
