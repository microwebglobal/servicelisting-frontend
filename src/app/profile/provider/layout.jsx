"use client";
import React from "react";
import ServiceProviderSideBar from "@components/serviceProvider/ServiceProviderSideBar";

const layout = ({ children }) => {
  return (
    <div>
      <div className="flex">
        <div className="fixed left-0 top-0 h-full w-64">
          <ServiceProviderSideBar />
        </div>

        <div className="flex-1 ml-72">{children}</div>
      </div>
    </div>
  );
};

export default layout;
