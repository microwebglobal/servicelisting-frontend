import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardImage, CardTitle } from "@/components/ui/card";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import Navbar from "@components/Navbar";
import FeaturedCard from "@components/ui/featuredCard";

export function CityServiceCategories({ cityName }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/services/${cityName}/${categorySlug}`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="mx-auto flex justify-between gap-20">
          <div className="w-2/5">
            <h1 className="text-4xl font-bold mb-2 capitalize">
              Services in {cityName}, India
            </h1>
            <hr className="mb-10" />

            {loading ? (
              <div className="text-center py-8">Loading services...</div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.category_id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <CardImage src="/assets/images/plumbing_icon.png" />
                    <CardHeader>
                      <CardTitle className="text-2xl hover:text-indigo-600">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="w-3/5">
            <Image
              src="/assets/images/hair_clean.png"
              alt="Professional"
              width={800}
              height={700}
              className="rounded-xl mb-10"
            />
            <hr />
            <h2 className="text-2xl mt-5 mb-10">Featured</h2>
            <div className="flex gap-5 overflow-x-auto scrollbar-hide">
              <FeaturedCard
                imageSrc="/assets/images/home_repair.webp"
                badgeText="123"
                price="5000"
                title="Home Repair Service"
                rating={4.5}
              />
              <FeaturedCard
                imageSrc="/assets/images/home_repair.webp"
                badgeText="123"
                price="5000"
                title="Home Repair Service"
                rating={4.5}
              />
              <FeaturedCard
                imageSrc="/assets/images/home_repair.webp"
                badgeText="123"
                price="5000"
                title="Home Repair Service"
                rating={4.5}
              />
              <FeaturedCard
                imageSrc="/assets/images/home_repair.webp"
                badgeText="123"
                price="5000"
                title="Home Repair Service"
                rating={4.5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
