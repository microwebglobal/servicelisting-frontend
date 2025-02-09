"use client";
import { useState, useEffect } from "react";
import { serviceAPI } from "../../api/services";

const CategoryPopup = ({ selectedItem }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Image */}
      {selectedItem.icon_url && (
        <img
          src={process.env.NEXT_PUBLIC_API_ENDPOINT + selectedItem.icon_url}
          alt={selectedItem.name}
          crossOrigin="anonymous"
          className="w-32 h-32 object-cover rounded-full shadow-md mb-5"
        />
      )}

      {/* Title */}
      <h6 className="font-semibold text-3xl text-center">
        {selectedItem.name}
      </h6>

      {/* Slug */}
      <p className="text-sm text-gray-600 mt-2 text-center mb-5">
        {selectedItem.slug}
      </p>

      {/* Dates */}
      <hr className="w-full" />
      <div className="mt-6 flex justify-between items-center w-full px-4 mb-5">
        <p className="text-sm text-gray-500">
          <strong>Created At:</strong>{" "}
          {new Date(selectedItem.created_at).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Updated At:</strong>{" "}
          {new Date(selectedItem.updated_at).toLocaleDateString()}
        </p>
      </div>
      <hr className="w-full" />
    </div>
  );
};

export default CategoryPopup;
