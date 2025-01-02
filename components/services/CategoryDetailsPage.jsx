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
import OfferCard from "@components/ui/offerCard";

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

        // Get category details with city name
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

        // Get subcategories for this category
        const subCategoriesResponse = await serviceAPI.getSubCategories(
          category.category_id
        );
        setSubCategories(subCategoriesResponse.data);
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto text-center py-8 text-red-600">
          <h2 className="text-xl">{error}</h2>
          <Button variant="ghost" className="mt-4" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>

          <h1 className="text-4xl font-bold mb-4">
            {category?.name} in {cityName}
          </h1>

          <img
            src={process.env.NEXT_PUBLIC_API_ENDPOINT + category.icon_url}
            crossOrigin="anonymous"
            alt="card_image"
            className="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
          />

          <h2 className="text-3xl font-semibold mb-4 text-center">
            What is {category?.name}?
          </h2>
          <div className="text-lg text-gray-700 text-center mb-8">
            <p>
              {category?.name} is an essential part of daily life in {cityName}.
              Whether you're looking for professional services, products, or
              local offers, this category encompasses everything you need. From
              reliable service providers to unique offerings, we’ve gathered all
              the top choices for you.
            </p>
            <p className="mt-4">
              Explore each subcategory below and dive into the available
              services designed to suit your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {subCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No subcategories available for this category
              </div>
            ) : (
              subCategories.map((subCategory) => (
                <Card
                  key={subCategory.sub_category_id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => handleSubCategoryClick(subCategory.slug)}
                >
                  <CardImage
                    src={
                      process.env.NEXT_PUBLIC_API_ENDPOINT +
                      subCategory.icon_url
                    }
                    crossOrigin="anonymous"
                    alt="card_image"
                  />
                  <CardHeader>
                    <CardTitle className="text-xl hover:text-indigo-600 transition-colors">
                      {subCategory.name}
                    </CardTitle>
                    {subCategory.description && (
                      <CardContent className="pt-2 px-0">
                        <p className="text-gray-600">
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
    </div>
  );
}

export default CategoryDetailsPage;
