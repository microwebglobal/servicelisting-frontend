"use client";
import React, { useState, useEffect } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { serviceAPI } from "../../api/services";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "@mui/icons-material";

const placeholderTexts = [
  "What service do you need today?",
  "Book a service instantly-Search here!",
  "Search for expert help in your area!",
  "Type a service or location to get started!",
];

const CitySelector = () => {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      const currentText = placeholderTexts[typingIndex];

      if (!isDeleting) {
        setPlaceholder(currentText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else {
        setPlaceholder(currentText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }

      if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % placeholderTexts.length);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [charIndex, isDeleting, typingIndex]);

  const fetchCities = async () => {
    try {
      const response = await serviceAPI.getCities();
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredCities([]);
      setShowDropdown(false);
      return;
    }

    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCities(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setSearchTerm(cityName);
    setFilteredCities([]);
    setShowDropdown(false);
    router.push(`/services/${cityName.toLowerCase()}`);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-4 top-[1.8rem] lg:top-[2.05rem] transform -translate-y-1/2 text-black size-6 lg:size-8" />

          <input
            type="text"
            className="p-3 pl-12 lg:pl-[3.7rem] w-full h-14 lg:h-16 border placeholder:text-black placeholder:text-base lg:placeholder:text-xl text-xl text-black focus:placeholder:text-transparent placeholder:font-medium border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-300"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
        </div>

        <button className="flex items-center justify-center size-14 aspect-square lg:size-16 bg-indigo-500 text-white rounded-xl hover:bg-blue-600 transition ml-4 shadow-md hover:shadow-lg">
          <FaLocationCrosshairs size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-black cursor-pointer transition-colors duration-200"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCitySelect(city.name);
                  }}
                >
                  {city.name}
                </motion.li>
              ))
            ) : (
              <motion.li
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-2 text-gray-500"
              >
                We Will Be Avilable Soon...
              </motion.li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitySelector;
