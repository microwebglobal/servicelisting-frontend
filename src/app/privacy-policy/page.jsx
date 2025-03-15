"use client";
import React, { useState, useEffect } from "react";

const PrivacyPolicyPage = () => {
  const [policies, setPolicies] = useState({});
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/policies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load policies");
        }
        return response.json();
      })
      .then((data) => {
        setPolicies(data);
        setSelectedPolicy(Object.keys(data)[0] || "");
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading policies...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {selectedPolicy}
        </h1>
        <p className="text-gray-600 text-justify">
          {policies[selectedPolicy] || "No policy available."}
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {Object.keys(policies).map((policy) => (
            <button
              key={policy}
              className={`px-4 py-2 rounded-lg text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                selectedPolicy === policy
                  ? "bg-blue-600"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
              onClick={() => setSelectedPolicy(policy)}
              aria-label={`View ${policy}`}
            >
              {policy}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
