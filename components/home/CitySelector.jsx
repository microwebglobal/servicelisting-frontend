"use client";
import React, { useState, useEffect } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { serviceAPI } from "../../api/services";

const CitySelector = () => {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await serviceAPI.getCities();
      console.log(response.data);
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      setFilteredCities(
        cities.filter((city) =>
          city.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredCities([]);
    }
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setSearchTerm(cityName);
    router.push(`/services/${cityName.toLowerCase()}`);
  };

  return (
    <div>
      <input
        type="text"
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        placeholder="Search for a location"
        style={{ width: "500px" }}
        value={searchTerm}
        onChange={handleSearch}
      />
      <button className="px-4 py-4 bg-indigo-500 text-white rounded-xl hover:bg-blue-600 transition ml-4">
        <FaLocationCrosshairs />
      </button>

      {filteredCities.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-2 w-full rounded-md shadow-lg">
          {filteredCities.map((city, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
              onClick={() => handleCitySelect(city.name)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySelector;
