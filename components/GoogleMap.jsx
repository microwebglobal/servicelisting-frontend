import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

// Container style for the map
const containerStyle = {
  width: "100%",
  height: "500px",
};

// India center
const center = {
  lat: 20.5937,
  lng: 78.9629,
};

// Define the coordinates for the polygons (example for one state)
const statePolygons = [
  {
    name: "Maharashtra",
    coordinates: [
      { lat: 19.7515, lng: 75.7139 },
      { lat: 19.0176, lng: 73.8567 },
      { lat: 18.5204, lng: 73.8567 },
      { lat: 18.5204, lng: 77.1237 },
    ],
  },
  {
    name: "Karnataka",
    coordinates: [
      { lat: 15.3173, lng: 75.7138 },
      { lat: 15.505, lng: 75.158 },
      { lat: 14.795, lng: 75.3873 },
      { lat: 14.0707, lng: 76.1225 },
    ],
  },
  // Add more states with their coordinates here...
];

const GoogleMapComponent = () => {
  const [selectedState, setSelectedState] = useState(null);

  // Handle polygon click to display the state name
  const handlePolygonClick = (stateName) => {
    setSelectedState(stateName);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCJtNNLCh343h9T1vBlno_a-6wrfSm_DMc">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        options={{
          fullscreenControl: true,
          mapTypeControl: false,
        }}
      >
        {/* Render polygons */}
        {statePolygons.map((state, index) => (
          <Polygon
            key={index}
            paths={state.coordinates}
            onClick={() => handlePolygonClick(state.name)}
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.4,
              strokeColor: "#FF0000",
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
        ))}

        {/* Display selected state name */}
        {selectedState && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            Selected State: {selectedState}
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
