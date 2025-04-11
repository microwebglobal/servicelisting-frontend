"use client";
import React from "react";
import withAuth from "@components/isAuth";
import ProfileSidebar from "@components/profile/sidebar";

const layout = ({ children }) => {
  return (
    <div>
      <div className="flex">
        <div className="fixed left-0 top-0 h-full w-64">
          <ProfileSidebar />
        </div>

        <div className="flex-1 ml-72">{children}</div>
      </div>
    </div>
  );
};

export default withAuth(layout, ["customer"]);
