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
    const requestBody = {
      u_id: localStorage.getItem("uId"),
      address_type: addresType,
      street: addressDetails.street,
      city: selectedCity,
      state: selectedState.name,
      postal_code: addressDetails.postalCode,
      country: "india",
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
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("error");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-scree">
      <div className=" flex gap-14 p-8 rounded-lg w-3/4">
        {step == 1 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-10">
              Select Your State And City
            </h2>

            <select
              value={selectedState?.state_id || ""}
              onChange={handleStateChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md w-full mt-10 mb-10"
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.state_id} value={state.state_id}>
                  {state.name}
                </option>
              ))}
            </select>

            {selectedState && (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md w-full mb-10"
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
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
              Select Your Location
            </h2>

            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
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

            <input
              type="text"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              placeholder="Add Tag"
              style={{ marginBottom: "100px", width: "400px" }}
              value={addresType}
              onChange={(e) => setAddresType(e.target.value)}
            />

            {/* <div className=" p-4  w-full">
              <h3 className="text-lg font-semibold text-gray-700">
                Selected Location:
              </h3>
              <p className="text-gray-600">Latitude: {selectedLocation.lat}</p>
              <p className="text-gray-600">Longitude: {selectedLocation.lng}</p>

              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                Address:
              </h3>
              <p className="text-gray-600">Street: {addressDetails.street}</p>
              <p className="text-gray-600">City: {selectedCity}</p>
              <p className="text-gray-600">State: {selectedState.name}</p>
              <p className="text-gray-600">Country: {addressDetails.country}</p>
              <p className="text-gray-600">
                Postal Code: {addressDetails.postalCode}
              </p>
            </div> */}
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-5"
              onClick={handleAdressSubmit}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewAdres;
