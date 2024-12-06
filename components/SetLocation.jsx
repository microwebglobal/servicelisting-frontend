"use client";
import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
};
const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const SetLocation = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc",
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState(center);
  const [searchInput, setSearchInput] = useState("");
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(location);
      setSearchInput(place.formatted_address || "");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div
      className="flex flex-col items-center bg-gray-50 py-20 rounded-lg max-w-4xl mx-auto"
      style={{ paddingLeft: "150px", paddingRight: "150px" }}
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-20">
        Set Your Location
      </h2>

      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md mb-10"
          placeholder="Search for a location"
          style={{ marginBottom: "100px", width: "500px" }}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Autocomplete>

      <div
        className="w-full mt-6 rounded-lg overflow-hidden"
        style={{ marginLeft: "40px", marginRight: "40px" }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={selectedLocation}
          zoom={14}
          onClick={(e) => {
            setSelectedLocation({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }}
        >
          <Marker
            position={selectedLocation}
            draggable
            onDragEnd={(e) => {
              setSelectedLocation({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              });
            }}
          />
        </GoogleMap>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full sm:w-96">
        <h3 className="text-lg font-semibold text-gray-700">
          Selected Location:
        </h3>
        <p className="text-gray-600">Latitude: {selectedLocation.lat}</p>
        <p className="text-gray-600">Longitude: {selectedLocation.lng}</p>
      </div>
    </div>
  );
};

export default SetLocation;
