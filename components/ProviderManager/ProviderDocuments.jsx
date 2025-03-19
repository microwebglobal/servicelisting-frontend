"use client";
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

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

  // Function to handle Verify and Reject actions
  const onUpdateStatus = async (documentId, newStatus, reason = "") => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/update-document-status/${documentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_status: newStatus,
            rejection_reason: reason,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update document status");

      // Update the local state to reflect the change
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.document_id === documentId
            ? {
                ...doc,
                verification_status: newStatus,
                rejection_reason: reason,
              }
            : doc
        )
      );

      // Close modal if rejecting
      if (newStatus === "rejected") {
        setShowRejectModal(false);
        setRejectionReason(""); // Reset the reason
      }
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  return (
    <div className="rounded-lg p-20 max-w-3xl mx-auto">
      <ul className="space-y-6">
        {documents.map((doc) => {
          const documentUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${doc.document_url}`;
          const statusBadge = getStatusBadge(doc.verification_status);

          return (
            <li
              key={doc.document_id}
              className="border p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Document Info */}
                <div className="flex items-center space-x-4">
                  {isImage(doc.document_url) && (
                    <FaFileImage className="w-6 h-6 text-blue-500" />
                  )}
                  {isPDF(doc.document_url) && (
                    <FaFilePdf className="w-6 h-6 text-red-500" />
                  )}
                  <p className="font-medium text-gray-900 capitalize">
                    {doc.document_type.replace("_", " ")}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${statusBadge.color} flex items-center`}
                >
                  {statusBadge.icon}
                  {doc.verification_status}
                </span>
              </div>

              {/* Document Preview */}
              <div className="mt-4">
                {isImage(doc.document_url) ? (
                  <img
                    src={documentUrl}
                    crossOrigin="anonymous"
                    alt={doc.document_type}
                    className="w-full max-w-xs h-auto rounded-lg shadow-sm"
                  />
                ) : isPDF(doc.document_url) ? (
                  <iframe
                    src={documentUrl}
                    crossOrigin="anonymous"
                    title={doc.document_type}
                    className="w-full h-64 rounded-lg shadow-sm"
                  ></iframe>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Preview not available for this file type.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaEye className="mr-2" /> View
                </a>
                <a
                  href={documentUrl}
                  download
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <FaDownload className="mr-2" /> Download
                </a>

                {/* Verify Button */}
                {doc.verification_status !== "verified" && (
                  <button
                    // onClick={() => onUpdateStatus(doc.document_id, "verified")}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <FaCheckCircle className="mr-2" /> Verify
                  </button>
                )}

                {/* Reject Button */}
                {doc.verification_status !== "rejected" && (
                  <button
                    onClick={() => {
                      setSelectedDocId(doc.document_id);
                      setShowRejectModal(true);
                    }}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTimesCircle className="mr-2" /> Reject
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800">
              Reject Document
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-2 mt-3 border rounded-lg"
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                // onClick={() =>
                //   onUpdateStatus(selectedDocId, "rejected", rejectionReason)
                // }
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDocuments;
