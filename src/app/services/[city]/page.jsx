"use client";

import { use } from 'react';
import { CityServiceCategories } from '@/components/services/CityServiceCategories';

export default function ServicePage({ params }) {
  const resolvedParams = use(params);
  const cityName = resolvedParams.city;

  return <CityServiceCategories cityName={cityName} />;
}