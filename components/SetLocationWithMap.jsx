"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 6.9271, lng: 79.8612 };

const SetLocationWithMap = ({
  initialLocation = null,
  onLocationSelect,
  className,
  countryRestriction = "in",
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const autocompleteRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      const coords = {
        lat: initialLocation.coordinates[0],
        lng: initialLocation.coordinates[1],
      };
      setMarkerPosition(coords);
      map?.panTo(coords);
      fetchAddress(coords.lat, coords.lng);
    }
  }, [initialLocation, map]);

  const fetchAddress = async (lat, lng) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
      );
      const data = await response.json();

      if (data.results?.length) {
        const place = data.results[0];
        setSearchInput(place.formatted_address || "");

        const getAddressComponent = (type) =>
          place.address_components?.find((comp) => comp.types.includes(type))
            ?.long_name || "";

        const addressDetails = {
          street: getAddressComponent("route"),
          city: getAddressComponent("locality"),
          state: getAddressComponent("administrative_area_level_1"),
          country: getAddressComponent("country"),
          postalCode: getAddressComponent("postal_code"),
        };

        if (onLocationSelect) {
          onLocationSelect({
            type: "point",
            coordinates: [lat, lng],
            address: place.formatted_address,
            details: addressDetails,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error fetching address details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarkerPosition({ lat, lng });
      map?.panTo({ lat, lng });
      fetchAddress(lat, lng);
      console.log(lat, lng);
    }
    setSearchInput(place.formatted_address || "");
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setSearchInput("Detecting your location...");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          setMarkerPosition(coords);
          map?.panTo(coords);
          await fetchAddress(latitude, longitude);
        },
        (error) => {
          setIsLoading(false);
          setSearchInput("");
          let errorMsg;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg =
                "Location access was denied. Please enable it in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMsg = "The request to get your location timed out.";
              break;
            default:
              errorMsg =
                "An unknown error occurred while getting your location.";
          }
          toast({
            title: "Location Error",
            description: errorMsg,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const handleMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    fetchAddress(lat, lng);
  }, []);

  if (loadError) {
    return <div className="text-red-500">Error loading map.</div>;
  }

  if (!isLoaded) {
    return <div className="text-gray-500">Loading maps...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 w-full">
        <div className="flex-grow">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
            options={{
              componentRestrictions: { country: countryRestriction },
              fields: ["address_components", "geometry", "formatted_address"],
              types: ["address"],
            }}
          >
            <input
              type="text"
              className={cn(
                "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                className
              )}
              placeholder="Search for a location"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={isLoading}
            />
          </Autocomplete>
        </div>
        <button
          type="button"
          className={cn(
            "px-4 py-1 h-10 bg-indigo-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center justify-center",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleCurrentLocation}
          disabled={isLoading}
        >
          <FaLocationCrosshairs className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={15}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker
          position={markerPosition}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
};

export default SetLocationWithMap;
