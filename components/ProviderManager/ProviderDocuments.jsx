"use client";
import React from "react";

const ProviderDocuments = ({ provider, onCloseDialog }) => {
  if (
    !provider ||
    !provider.ServiceProviderDocuments ||
    provider.ServiceProviderDocuments.length === 0
  ) {
    return <p className="text-gray-500">No documents available.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Provider Documents</h2>
      <ul className="space-y-3">
        {provider.ServiceProviderDocuments.map((doc) => (
          <li key={doc.document_id} className="border p-3 rounded-lg shadow-sm">
            <p className="font-semibold capitalize">
              {doc.document_type.replace("_", " ")}
            </p>
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span className="font-medium">{doc.verification_status}</span>
            </p>
            <a
              href={
                process.env.NEXT_PUBLIC_API_ENDPOINT + "/" + doc.document_url
              }
              target="_blank"
              crossOrigin="anonymous"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2"
            >
              View Document
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderDocuments;
