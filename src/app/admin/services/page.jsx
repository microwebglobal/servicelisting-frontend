import ServiceManagement from "@components/services/ServiceManagement";

import React from "react";

const ServicesPage = () => {
  return (
    <div className="p-4">
      <h1 className="font-bold mb-4" style={{ fontSize: "28px" }}>
        Service Management
      </h1>
      <hr />
      <ServiceManagement />
    </div>
  );
};

export default ServicesPage;
