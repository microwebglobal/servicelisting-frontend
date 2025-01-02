"use client";

import { use } from "react";
import { CityServiceCategories } from "@/components/services/CityServiceCategories";

export default function ServicePage({ params, searchParams }) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const cityName = resolvedParams.city;
  const cityId = resolvedSearchParams?.city_id;

  return <CityServiceCategories cityName={cityName} cityId={cityId} />;
}
