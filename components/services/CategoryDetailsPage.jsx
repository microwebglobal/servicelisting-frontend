import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardImage,
  CardContent,
} from "@/components/ui/card";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const handleSubCategoryClick = (subCategorySlug) => {
    router.push(`/services/${cityName}/${categorySlug}/${subCategorySlug}`);
  };

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
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          {category?.name} in {cityName}
        </h1>

        <div className="flex justify-center">
          <img
            src={process.env.NEXT_PUBLIC_API_ENDPOINT + category.icon_url}
            crossOrigin="anonymous"
            alt="Category Image"
            className="w-full md:w-3/4 lg:w-2/3 h-64 object-cover rounded-xl shadow-lg"
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold mt-8 text-center">
          What is {category?.name}?
        </h2>
        <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto mt-4 leading-relaxed">
          {category?.name} is an essential part of daily life in {cityName}.
          Whether you're looking for professional services, products, or local
          offers, this category encompasses everything you need. Explore each
          subcategory below to find what suits your needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {subCategories.length === 0 ? (
            <div className="text-center col-span-full text-gray-600">
              No subcategories available for this category.
            </div>
          ) : (
            subCategories.map((subCategory) => (
              <Card
                key={subCategory.sub_category_id}
                className="cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-xl"
                onClick={() => handleSubCategoryClick(subCategory.slug)}
              >
                <CardImage
                  src={
                    process.env.NEXT_PUBLIC_API_ENDPOINT + subCategory.icon_url
                  }
                  crossOrigin="anonymous"
                  alt="Subcategory Image"
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <CardHeader className="p-4">
                  <CardTitle className="text-lg md:text-xl font-medium text-indigo-700 hover:text-indigo-500 transition-colors">
                    {subCategory.name}
                  </CardTitle>
                  {subCategory.description && (
                    <CardContent className="pt-2">
                      <p className="text-gray-600 text-sm">
                        {subCategory.description}
                      </p>
                    </CardContent>
                  )}
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetailsPage;
