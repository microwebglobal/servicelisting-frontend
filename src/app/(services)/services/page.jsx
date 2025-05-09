"use client";

import { useUserLocation } from "@/src/hooks/useUserLocation";
import { redirect } from "next/navigation";

const ServicePage = () => {
  const { city, loading } = useUserLocation();

  if (loading) {
    return "loading";
  }

  return redirect(`/services/${city}`);
};

export default ServicePage;
