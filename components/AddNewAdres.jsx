"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useRouter } from "next/navigation";

const libraries = ["places"];
const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const AddNewAdres = () => {
  const router = useRouter();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState(center);
  const [searchInput, setSearchInput] = useState("");
  const autocompleteRef = useRef(null);
  const [addresType, setAddresType] = useState("");

  const [addressDetails, setAddressDetails] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(location);
      setSearchInput(place.formatted_address || "");

      // Extract address components
      const addressComponents = place.address_components || []; //array of objects including part of a adress
      const getAddressComponent = (type) => {
        //write helper function to extract parts
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

  const handleAdressSubmit = async () => {
    const requestBody = {
      u_id: localStorage.getItem("userId"),
      address_type: addresType,
      street: addressDetails.street,
      city: addressDetails.city,
      state: addressDetails.state,
      postal_code: addressDetails.postalCode,
      country: addressDetails.country,
      long: selectedLocation.lng,
      lat: selectedLocation.lat,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/adress/`,
        requestBody
      );
      console.log("Response:", response.data);
      console.log(requestBody);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("error");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center">
      <div className=" flex p-8 rounded-lg w-3/4">
        <div>
          <h2 className="text-2xl font-bold text-back mb-10">
            Add Secondry Address
          </h2>

          <label className="mb-5">Enter your address</label>

          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
            options={{
              componentRestrictions: { country: "in" },
            }}
          >
            <input
              type="text"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              placeholder="Search for a location"
              style={{ marginBottom: "100px", width: "400px" }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Autocomplete>

          <label className="mb-5" style={{ marginBottom: "5px" }}>
            Set Tag for secondry adress
          </label>

          <input
            type="text"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            placeholder="ex: Home, Office..."
            style={{ marginBottom: "100px", width: "400px" }}
            value={addresType}
            onChange={(e) => setAddresType(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5"
            onClick={handleAdressSubmit}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAdres;
