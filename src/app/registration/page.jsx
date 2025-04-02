import React from "react";
import Link from "next/link";
import IndividualProviderInquiryForm from "@components/forms/InquiryForms/IndividualProviderInquiryForm";
import BusinessProviderInquiryForm from "@components/forms/InquiryForms/BusinessProviderInquiryForm";

export const dynamic = 'force-dynamic';

const Registration = () => {
  return (
    <div className="flex gap-4">
      <BusinessProviderInquiryForm />
    </div>
  );
};

export default Registration;
