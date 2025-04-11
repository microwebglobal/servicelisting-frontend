"use client";

import { useState, useEffect } from "react";

export function useUserLocation() {
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ");
      const locationCookie = cookies.find((cookie) =>
        cookie.startsWith("current-location=")
      );

      if (locationCookie) {
        const value = locationCookie.split("=")[1];
        try {
          setCity(decodeURIComponent(value));
        } catch (err) {
          console.error("Failed to decode city from cookie:", err);
        }
      }

      setLoading(false);
    }
  }, []);

  return { city, loading };
}
