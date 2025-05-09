"use client";

import { use } from "react";
import { CategoryDetailsPage } from "@/components/services/CategoryDetailsPage";

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const { city, category } = resolvedParams;

  return <CategoryDetailsPage cityName={city} categorySlug={category} />;
}
