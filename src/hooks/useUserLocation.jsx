"use client";

import { useState, useEffect } from "react";

export function useUserLocation() {
  const [city, setCity] = (useState < string) | (undefined > undefined);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const userCityCookie = cookies.find((cookie) =>
      cookie.startsWith("user-city=")
    );

    if (userCityCookie) {
      const cityValue = userCityCookie.split("=")[1];
      setCity(decodeURIComponent(cityValue));
    }
  }, []);

  return city;
}
