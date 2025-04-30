import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SubCategoryCard from "./SubCategoryCard";

export function CategoryDetailsPage({ cityName, categorySlug }) {
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!cityName || !categorySlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const categoryResponse = await serviceAPI.getCategoryBySlug(
          categorySlug,
          cityName
        );
        const category = categoryResponse.data;

        if (!category) {
          setError("Category not found");
          toast({
            title: "Error",
            description: "Category not found in this city",
            variant: "destructive",
          });
          return;
        }

        setCategory(category);

        const subCategoriesResponse = await serviceAPI.getSubCategories(
          category.category_id
        );

        const sortedSubCategories = [...subCategoriesResponse.data].sort(
          (a, b) => a.display_order - b.display_order
        );

        setSubCategories(sortedSubCategories);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError("Failed to load data");
        toast({
          title: "Error",
          description: "Failed to load category details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [cityName, categorySlug, toast]);

  const handleBack = () => {
    router.push(`/services/${cityName}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-lg text-gray-700">
          Loading category details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h2 className="text-xl text-red-600">{error}</h2>
        <Button variant="ghost" className="mt-4" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-14">
        <div>
          <Button
            variant="ghost"
            className="mb-2 -ml-1 p-0 hover:bg-transparent hover:text-[#5f60b9]"
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Categories
          </Button>

          <h1 className="text-2xl font-bold z-20">
            {category?.name} in {cityName}
          </h1>
        </div>

        <div className="relative w-full h-[300px]">
          <Image
            fill
            src={process.env.NEXT_PUBLIC_API_ENDPOINT + category.icon_url}
            crossOrigin="anonymous"
            alt="Category Image"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8">
            What is {category?.name}?
          </h2>

          <p className="text-sm text-gray-700 mt-4 leading-relaxed">
            {category?.name} is an essential part of daily life in {cityName}.
            Whether you're looking for professional services, products, or local
            offers, this category encompasses everything you need. Explore each
            subcategory below to find what suits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {subCategories.length === 0 ? (
            <div className="text-center col-span-full text-gray-600">
              No subcategories available for this category.
            </div>
          ) : (
            subCategories.map((subCategory) => (
              <div key={subCategory.id}>
                <SubCategoryCard
                  name={subCategory.name}
                  icon_url={subCategory.icon_url}
                  url={`/services/${cityName}/${categorySlug}/${subCategory.slug}`}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetailsPage;
