import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardImage, CardTitle } from "@/components/ui/card";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import FeaturedCard from "@/components/ui/featuredCard";
import { LocationSwitcher } from "./LocationSwitcher";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import { ExpandableCategory } from "../CategoryGrid";

export function CityServiceCategories({ cityName = "" }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);
  const router = useRouter();
  const { toast } = useToast();
  const [isNotInServiceArea, setIsNotInServiceArea] = useState(false);

  // Fetch city and categories in a single useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (!cityName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First get city
        const citiesResponse = await serviceAPI.getCities();
        const matchedCity = citiesResponse.data.find(
          (city) => city.name.toLowerCase() === cityName.toLowerCase()
        );

        if (!matchedCity) {
          setIsNotInServiceArea(true);
          return;
        }

        setCity(matchedCity);

        // Then get categories for this city
        const categoriesResponse = await serviceAPI.getCategories(
          matchedCity.city_id
        );
        const sortedCategories = [...categoriesResponse.data].sort(
          (a, b) => a.display_order - b.display_order
        );

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName, toast]);

  const handleCategoryClick = (categorySlug) => {
    router.push(`/services/${cityName}/${categorySlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (isNotInServiceArea) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="text-center py-8 space-y-8">
          <h2 className="text-2xl font-semibold">
            Sorry, We do not provide services in {cityName.replace("%20", " ")}.
          </h2>

          <div className="space-y-4 max-w-md mx-auto">
            <p>Please select a different city.</p>
            <LocationSwitcher />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="text-center py-8 text-red-600">
          <h2 className="text-xl">{error}</h2>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="text-center py-8">
          <h2 className="text-xl text-gray-600">
            Please select a valid city to view available services
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-20 mt-14">
        <div className="w-full lg:w-2/5">
          <h1 className="text-4xl font-bold mb-5 capitalize">
            Services in {cityName}, India
          </h1>

          <LocationSwitcher />

          {categories.length === 0 ? (
            <div className="text-center py-8">
              No services available in this city
            </div>
          ) : (
            <>
              <ExpandableCategory categories={categories} />
            </>
          )}
        </div>

        <div className="w-full lg:w-3/5">
          <Image
            src="/assets/images/hair_clean.png"
            alt="Professional Services"
            width={1280}
            height={768}
            className="rounded-xl mb-10 min-h-[420px] object-cover"
            priority
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Label className="text-2xl font-semibold">Featured Services</Label>
          <Button
            variant="secondary"
            className="bg-[#5f60b9]/10 text-[#5f60b9] font-semibold"
          >
            Show All
          </Button>
        </div>

        <Carousel>
          <CarouselContent className="pl-8">
            {[1, 2, 3, 4].map((index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/3 lg:basis-1/4 -ml-8"
              >
                <FeaturedCard
                  imageSrc="/assets/images/hair_clean.png"
                  badgeText="123"
                  price="5000"
                  title="Home Repair Service"
                  rating={4.5}
                  providerName="Abc Home Services"
                  providerAvatar="/assets/images/hair_clean.png"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default CityServiceCategories;
