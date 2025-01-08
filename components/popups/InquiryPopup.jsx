"use client";
import {
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const InquiryPopup = ({ inquiry }) => {
  if (!inquiry) return null;

  return (
    <div className="w-full max-w-2xl p-2 ">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Inquiry Details
      </h2>

      {/* User Details */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <FaUser className="text-gray-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-700">
            User Information
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Name:</span> {inquiry.User?.name}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {inquiry.User?.role}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {inquiry.User?.email}
          </p>
          <p>
            <span className="font-semibold">Mobile:</span>{" "}
            {inquiry.User?.mobile}
          </p>
          <p>
            <span className="font-semibold">Gender:</span>{" "}
            {inquiry.User?.gender}
          </p>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-4">
        <div className="flex items-center gap-3">
          <FaBriefcase className="text-gray-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-700">
            Business Information
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Business Type:</span>{" "}
            {inquiry.business_type}
          </p>
          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {inquiry.years_experience} Years
          </p>
          <p>
            <span className="font-semibold">Status:</span>
            <span
              className={`px-2 py-1 ml-2 text-xs font-semibold rounded-full 
              ${
                inquiry.status === "Approved"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {inquiry.status}
            </span>
          </p>
        </div>
      </div>

      {/* Location */}
      {inquiry.primary_location && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-4">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-700">Location</h3>
          </div>
          <p className="text-sm text-gray-700 mt-2">
            {inquiry.primary_location.coordinates[1]},{" "}
            {inquiry.primary_location.coordinates[0]}
          </p>
        </div>
      )}

      {/* Service Categories */}
      {inquiry.ServiceCategories?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Service Categories
          </h3>
          <div className="flex flex-wrap gap-3 mt-3">
            {inquiry.ServiceCategories.map((category) => (
              <div
                key={category.category_id}
                className="flex flex-col items-center text-center"
              >
                {category.icon_url && (
                  <img
                    src={
                      process.env.NEXT_PUBLIC_API_ENDPOINT + category.icon_url
                    }
                    alt={category.name}
                    crossOrigin="anonymous"
                    className="w-14 h-14 object-cover rounded-full shadow-md"
                  />
                )}
                <p className="text-sm font-medium text-gray-900">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cities */}
      {inquiry.Cities?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Cities</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {inquiry.Cities.map((city) => (
              <span
                key={city.city_id}
                className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full"
              >
                {city.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-4">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-gray-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-700">Timestamps</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Created At: {new Date(inquiry.created_at).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          Updated At: {new Date(inquiry.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default InquiryPopup;
