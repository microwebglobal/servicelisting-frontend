import InquiryManager from "@components/inquiryManager/InquiryManager";
import React from "react";

const InquiryPage = () => {
  return (
    <div className="p-4">
      <h1 className="font-bold mb-4" style={{ fontSize: "28px" }}>
        Inquiry Management
      </h1>
      <hr />
      <InquiryManager />
    </div>
  );
};

export default InquiryPage;
