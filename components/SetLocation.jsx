"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaLocationCrosshairs } from "react-icons/fa6";

const libraries = ["places"];
const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const SetLocation = () => {
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

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc`
            );
            const place = response.data.results[0];
            setSearchInput(place.formatted_address);

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
    <>
      <div>
        <h2 className="text-3xl text-center font-bold mb-1">
          Select Your Location
        </h2>
        <p className="text-center mb-14">Add your primary location</p>

        <div
          className="flex gap-3"
          style={{ marginBottom: "100px", marginTop: "100px" }}
        >
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
              style={{ width: "400px" }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Autocomplete>

          <button
            className="px-4 bg-indigo-500 text-white rounded-xl hover:bg-blue-600 transition"
            onClick={handleCurrentLocation}
          >
            <FaLocationCrosshairs />
          </button>
        </div>

        <button
          className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5 "
          onClick={handleAdressSubmit}
        >
          Finish
        </button>
      </div>
    </>
  );
};

export default SetLocation;
