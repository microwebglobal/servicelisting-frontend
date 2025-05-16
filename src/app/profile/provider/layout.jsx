"use client";
import React from "react";
import withAuth from "@components/isAuth";
import ServiceProviderSideBar from "@components/serviceProvider/ServiceProviderSideBar";
import { ProfileRefreshProvider } from "@/src/context/ProfileRefreshContext";

const layout = ({ children }) => {
  return (
    <ProfileRefreshProvider>
      <div>
        <div className="flex">
          <div className="fixed left-0 top-0 h-full w-64">
            <ServiceProviderSideBar />
          </div>

          <div className="flex-1 ml-72 bg-gray-50 min-h-screen">{children}</div>
        </div>
      </div>
    </ProfileRefreshProvider>
  );
};

export default withAuth(layout, [
  "service_provider",
  "business_service_provider",
]);
