"use client";
import React from "react";
import ServiceProviderSideBar from "@components/serviceProvider/ServiceProviderSideBar";

const layout = ({ children }) => {
  return (
    <div>
      <div className="flex">
        <ServiceProviderSideBar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default layout;
