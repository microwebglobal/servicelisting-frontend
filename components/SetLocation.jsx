"use client";
import React, { useState, useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const libraries = ["places"];
const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const SetLocation = () => {
  const router = useRouter();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc",
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
      u_id: localStorage.getItem("uId"),
      address_type: "primary",
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
        "http://localhost:8080/api/adress/",
        requestBody
      );
      console.log("Response:", response.data);
      console.log(requestBody);
      router.push("/profile/customer");
    } catch (error) {
      console.error("Error:", error);
      console.log(requestBody);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white flex gap-14 p-8 rounded-lg shadow-md w-3/4">
        <Image
          src="/assets/images/reg_img.png"
          alt="John Doe"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
        />
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-10">
            Select Your Location
          </h2>

          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
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

          <div className=" p-4  w-full">
            <h3 className="text-lg font-semibold text-gray-700">
              Selected Location:
            </h3>
            <p className="text-gray-600">Latitude: {selectedLocation.lat}</p>
            <p className="text-gray-600">Longitude: {selectedLocation.lng}</p>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">
              Address:
            </h3>
            <p className="text-gray-600">Street: {addressDetails.street}</p>
            <p className="text-gray-600">City: {addressDetails.city}</p>
            <p className="text-gray-600">State: {addressDetails.state}</p>
            <p className="text-gray-600">Country: {addressDetails.country}</p>
            <p className="text-gray-600">
              Postal Code: {addressDetails.postalCode}
            </p>
          </div>
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

export default SetLocation;
