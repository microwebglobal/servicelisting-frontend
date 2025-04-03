"use client";
import { providerAPI } from "@/api/provider";
import { DockIcon, ImageIcon } from "lucide-react";
import React, { useState } from "react";
import {
  FaFilePdf,
  FaFileImage,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";

const ProviderDocuments = ({ provider }) => {
  const [documents, setDocuments] = useState(
    provider?.ServiceProviderDocuments || []
  );

  if (!documents.length) {
    return <p className="text-gray-500 text-center">No documents available.</p>;
  }

  const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url);
  const isPDF = (url) => /\.pdf$/i.test(url);

  const getStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase();
    const statuses = {
      verified: {
        color: "bg-green-100 text-green-800 border-green-400",
        icon: <FaCheckCircle className="mr-1 text-green-600" />,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-400",
        icon: <FaClock className="mr-1 text-yellow-600" />,
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-400",
        icon: <FaTimesCircle className="mr-1 text-red-600" />,
      },
    };

    return (
      statuses[lowerStatus] || {
        color: "bg-gray-100 text-gray-800 border-gray-400",
        icon: null,
      }
    );
  };

  return (
    <div className=" mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => {
          const documentUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${doc.document_url}`;
          const statusBadge = getStatusBadge(doc.verification_status);

          return (
            <div
              key={doc.document_id}
              className="border rounded-lg shadow-md bg-white p-5 transition-transform transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {isImage(doc.document_url) && (
                    <ImageIcon className="w-6 h-6" />
                  )}
                  {isPDF(doc.document_url) && (
                    <DockIcon className="w-6 h-6 text-red-500" />
                  )}
                  <p className="font-medium text-gray-900 capitalize">
                    {doc.document_type.replace("_", " ")}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${statusBadge.color} flex items-center`}
                >
                  {statusBadge.icon}
                  {doc.verification_status}
                </span>
              </div>

              {/* Document Preview */}
              <div className="mb-4">
                {isImage(doc.document_url) ? (
                  <img
                    src={documentUrl}
                    crossOrigin="anonymous"
                    alt={doc.document_type}
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                  />
                ) : isPDF(doc.document_url) ? (
                  <embed
                    src={documentUrl}
                    type="application/pdf"
                    width="100%"
                    height="160px"
                    className="rounded-lg shadow-sm"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">
                    Preview not available for this file type.
                  </p>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaEye />
                </a>
                <a
                  href={documentUrl}
                  download
                  className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-green-700 transition"
                >
                  <FaDownload />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderDocuments;
