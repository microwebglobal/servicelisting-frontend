"use client";

import { use } from 'react';
import CityServicesPage from '@/components/CityServicesPage'; 

export default function ServicePage({ params }) {
  const resolvedParams = use(params);
  const cityName = resolvedParams.city;

  return <CityServicesPage cityName={cityName} />;
}