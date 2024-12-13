"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const libraries = ["places"];
const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const ProviderLocation = ({ onLocSubmit, onLocation }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc",
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState(center);
  const [searchInput, setSearchInput] = useState("");
  const autocompleteRef = useRef(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const [selectedCity, setSelectedCity] = useState("");

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

  useEffect(() => {
    const fetchStates = async () => {
      const response = await axios.get("http://localhost:8080/api/state/");
      setStates(response.data);
      console.log(response.data);
    };

    fetchStates();
  }, []);

  const handleStateChange = async (e) => {
    const newStateId = e.target.value;
    const stateId = Number(newStateId);
    const selectedState = states.find((state) => state.state_id === stateId);
    setSelectedState(selectedState);

    console.log("Selected state:", selectedState);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/city/state/${newStateId}`
      );
      setCities(response.data);
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleAdressSubmit = async () => {
    onLocSubmit({
      address_type: "primary",
      street: addressDetails.street,
      city: selectedCity,
      state: selectedState.name,
      postal_code: addressDetails.postalCode,
      country: "india",
      long: selectedLocation.lng,
      lat: selectedLocation.lat,
    });
    console.log(addressDetails);

    try {
      onLocation();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      {step == 1 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-10">
            Select Your State And City
          </h2>

          <label className="mt-10">State:</label>
          <select
            value={selectedState?.state_id || ""}
            onChange={handleStateChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md w-full mb-10 mt-4"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.state_id} value={state.state_id}>
                {state.name}
              </option>
            ))}
          </select>

          {selectedState && (
            <>
              <label className="mt-10">City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md w-full mb-10 mt-4"
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5"
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </div>
      )}

      {step == 2 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-10">
            Enter Your Primary Address
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

          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5"
            onClick={handleCurrentLocation}
          >
            Use Current Location
          </button>

          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5"
            onClick={handleAdressSubmit}
          >
            Continue
          </button>
        </div>
      )}
    </>
  );
};

export default ProviderLocation;
