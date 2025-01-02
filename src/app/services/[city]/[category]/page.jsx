"use client";

import { use } from "react";
import { CategoryDetailsPage } from "@/components/services/CategoryDetailsPage";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const { city, category } = resolvedParams;

  return (
    <div>
      <Navbar />

      <CategoryDetailsPage cityName={city} categorySlug={category} />
      <Footer />
    </div>
  );
}
