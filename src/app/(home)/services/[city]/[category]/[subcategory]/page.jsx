"use client";

import { use } from "react";
import { SubCategoryDetailsPage } from "@/components/services/SubCategoryDetailsPage";

export default function SubCategoryPage({ params }) {
  const resolvedParams = use(params);
  const { city, category, subcategory } = resolvedParams;

  return (
    <SubCategoryDetailsPage
      cityName={city}
      categorySlug={category}
      subCategorySlug={subcategory}
    />
  );
}
