import React, { useState, useEffect } from "react";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { LocationSwitcher } from "./LocationSwitcher";

import { ExpandableCategory } from "../CategoryGrid";
import FeaturedSection from "./FeaturedSection";
import { Label } from "../ui/label";
import SubCategoryCard from "./SubCategoryCard";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export function CityServiceCategories({ cityName = "" }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);
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
        const matchedCity = citiesResponse.data.find((city) =>
          cityName.toLowerCase().includes(city.name.toLowerCase())
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

  if (!city || cityName === "Unknown") {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="text-center py-8 space-y-8">
          <h2 className="text-2xl font-semibold">
            Please select your location to view services.
          </h2>

          <div className="max-w-md mx-auto">
            <LocationSwitcher />
          </div>
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

  return (
    <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 xl:space-y-20 px-5 xl:px-0">
      <div className="mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-20 mt-5 lg:mt-14">
        <div className="w-full lg:w-2/5">
          <h1 className="text-2xl md:text-3xl font-bold mb-5 capitalize">
            Services in {cityName}, India
          </h1>

          <LocationSwitcher />

          {categories.length === 0 ? (
            <div className="text-center py-8">
              No services available in this city
            </div>
          ) : (
            <div className="pt-3 md:pt-8 space-y-2">
              <Label className="hidden md:block font-medium">
                Explore our services,
              </Label>
              <ExpandableCategory categories={categories} cityName={cityName} />
            </div>
          )}
        </div>

        <div className="w-full lg:w-3/5 hidden md:grid grid-cols-2 grid-rows-2 gap-3">
          <div className="relative col-span-1 row-span-2">
            <Image
              src="/assets/images/home_repair.webp"
              alt="service_banner_1"
              fill
              className="rounded-md object-cover w-full h-full"
              priority
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 40%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 70%)",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            />
          </div>

          <div className="relative col-span-1 row-span-1">
            <Image
              src="/assets/images/herobg-5.jpg"
              alt="service_banner_2"
              fill
              className="rounded-md object-cover w-full h-full"
              priority
            />
          </div>

          <div className="relative col-span-1 row-span-1">
            <Image
              src="/assets/images/herobg-2.jpg"
              alt="service_banner_3"
              fill
              className="rounded-md object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>

      <FeaturedSection />

      {categories.map(
        (category) =>
          category.SubCategories.length > 0 && (
            <div key={category.category_id} className="space-y-10">
              <div className="flex justify-between items-center">
                <Label className="text-lg md:text-2xl font-semibold">
                  {category.name}
                </Label>

                <Button
                  asChild
                  variant="secondary"
                  className="bg-[#5f60b9]/10 text-[#5f60b9] font-semibold h-9 px-3 md:px-4 md:h-10"
                >
                  <Link href={`/services/${cityName}/${category.slug}`}>
                    See All
                  </Link>
                </Button>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 1,
                }}
                className="w-full"
              >
                <CarouselContent className="flex gap-5 scroll-snap-x scroll-snap-mandatory">
                  {category.SubCategories.map((sub) => (
                    <CarouselItem
                      key={`${category.category_id}-${sub.sub_category_id}`}
                      className="!w-56 basis-56 shrink-0 scroll-snap-start"
                    >
                      <div className="p-1">
                        <SubCategoryCard
                          key={`${category.category_id}-${sub.sub_category_id}`}
                          name={sub.name}
                          icon_url={sub.icon_url}
                          url={`/services/${cityName}/${category.slug}/${sub.slug}`}
                        />
                      </div>
                    </CarouselItem>
                  ))}

                  {/* Spacer to prevent early disabling of the Next button */}
                  <div className="shrink-0 w-[16px]" />
                </CarouselContent>

                {category.SubCategories.length > 4 && (
                  <>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                  </>
                )}
              </Carousel>
            </div>
          )
      )}
    </div>
  );
}

export default CityServiceCategories;
