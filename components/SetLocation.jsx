"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const libraries = ["places"];
const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const SetLocation = ({ location, setLocation, className }) => {
  const router = useRouter();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState(center);
  const [searchInput, setSearchInput] = useState("");
  const autocompleteRef = useRef(null);

  const [addressDetails, setAddressDetails] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  // Function to fetch address by location
  const getAddressByLocation = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coordinates[0]},${location.coordinates[1]}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
      );
      const place = response.data.results[0];
      setSearchInput(place.formatted_address || "");

      // Extract address components
      const addressComponents = place.address_components || [];
      const getAddressComponent = (type) => {
        const component = addressComponents.find((comp) =>
          comp.types.includes(type)
        );
        return component ? component.long_name : "";
      };

      setAddressDetails({
        street: getAddressComponent("route"),
        city: getAddressComponent("locality"),
        state: getAddressComponent("administrative_area_level_1"),
        country: getAddressComponent("country"),
        postalCode: getAddressComponent("postal_code"),
      });
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // useEffect to fetch address when location prop changes
  useEffect(() => {
    if (location) {
      getAddressByLocation();
    }
  }, [location]);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const newLocation = {
        type: "point",
        coordinates: [
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ],
      };
      setLocation(newLocation);
      setSearchInput(place.formatted_address || "");

      // Extract address components
      const addressComponents = place.address_components || [];
      const getAddressComponent = (type) => {
        const component = addressComponents.find((comp) =>
          comp.types.includes(type)
        );
        return component ? component.long_name : "";
      };

      setAddressDetails({
        street: getAddressComponent("route"),
        city: getAddressComponent("locality"),
        state: getAddressComponent("administrative_area_level_1"),
        country: getAddressComponent("country"),
        postalCode: getAddressComponent("postal_code"),
      });
    }
  };

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          const newLocation = {
            type: "point",
            coordinates: [latitude, longitude],
          };
          setLocation(newLocation);

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
            );

            if (response.data.results && response.data.results.length > 0) {
              const place = response.data.results[0];

              if (place.formatted_address) {
                setSearchInput(place.formatted_address);
              } else {
                console.warn("No formatted address found for this location.");
              }

              const addressComponents = place.address_components || [];
              const getAddressComponent = (type) => {
                const component = addressComponents.find((comp) =>
                  comp.types.includes(type)
                );
                return component ? component.long_name : "";
              };

              setAddressDetails({
                street: getAddressComponent("route"),
                city: getAddressComponent("locality"),
                state: getAddressComponent("administrative_area_level_1"),
                country: getAddressComponent("country"),
                postalCode: getAddressComponent("postal_code"),
              });
            } else {
              console.warn("No results found for the given coordinates.");
            }
          } catch (error) {
            console.error("Error fetching address from coordinates:", error);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div className="flex gap-3 mb-2">
        <div className="flex-grow">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
            options={{
              componentRestrictions: { country: "in" },
            }}
          >
            <input
              type="text"
              className={cn(
                "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4",
                className
              )}
              placeholder="Search for a location"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Autocomplete>
        </div>

        <button
          type="button"
          className="sm:mt-0 sm:w-auto px-4 py-1 h-10 bg-indigo-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center justify-center"
          onClick={handleCurrentLocation}
        >
          <FaLocationCrosshairs />
        </button>
      </div>
    </>
  );
};

export default SetLocation;
