"use client";
import { useState, useEffect } from "react";
import { serviceAPI } from "../../api/services";
import DOMPurify from "dompurify";

const ServiceItemPopup = ({ selectedItem }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await serviceAPI.getCities();
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Helper function to get the city name by id
  const getCityNameById = (cityId) => {
    const city = cities.find((city) => city.city_id === cityId);
    return city ? city.name : "Unknown City";
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h6 className="font-semibold text-3xl text-center">
        {selectedItem.name}
      </h6>
      <p className="text-sm text-gray-600 mt-10 text-center mb-10">
        {selectedItem.description}
      </p>

      {/* Base Price */}
      <hr />
      <div className="mt-6 flex justify-between items-center mb-5">
        <p className="text-sm text-gray-500">
          <strong>Base Price:</strong> Rs. {selectedItem.base_price}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Created At:</strong>{" "}
          {new Date(selectedItem.created_at).toLocaleDateString()}
        </p>
      </div>
      <hr />

      {/* City-Specific Pricing */}
      {selectedItem.CitySpecificPricings?.length > 0 && (
        <div className="mt-6">
          <strong className="text-lg">City-Specific Pricing:</strong>
          <ul className="text-sm text-gray-500 list-disc pl-5 mt-2 space-y-2">
            {selectedItem.CitySpecificPricings.map((pricing, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{getCityNameById(pricing.city_id)}</span>
                <span>Rs. {pricing.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Special Pricing */}
      {selectedItem.SpecialPricings?.length > 0 && (
        <div className="mt-6">
          <strong className="text-lg">Special Pricing:</strong>
          <ul className="text-sm text-gray-500 list-disc pl-5 mt-2 space-y-2">
            {selectedItem.SpecialPricings.map((pricing, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{getCityNameById(pricing.city_id)}</span>
                <span>Rs. {pricing.special_price}</span>
                <span>{new Date(pricing.start_date).toLocaleDateString}</span>
                <span>{new Date(pricing.end_date).toLocaleDateString}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* overview */}
      <div className="mt-10">
        {selectedItem.overview && (
          <>
            <strong className="text-lg">Overview:</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedItem.overview),
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceItemPopup;
