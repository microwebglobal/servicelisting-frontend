import React, { useState, useEffect } from "react";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { LocationSwitcher } from "./LocationSwitcher";

import { ExpandableCategory } from "../CategoryGrid";
import FeaturedSection from "./FeaturedSection";
import { Label } from "../ui/label";

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
            <div className="pt-8">
              <Label className=" text-muted-foreground">
                Explore our services,
              </Label>

              <ExpandableCategory categories={categories} cityName={cityName} />
            </div>
          )}
        </div>

        <div className="w-full lg:w-3/5 hidden md:block">
          <Image
            src="/assets/images/home_repair.webp"
            alt="service_banner"
            width={1280}
            height={768}
            className="rounded-md min-h-[420px] object-cover"
            priority
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 40%)",
              maskImage: "linear-gradient(to right, transparent 0%, black 70%)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />
        </div>
      </div>

      <FeaturedSection />

      {categories.map((category) => (
        <div key={category.category_id} className="space-y-10">
          <Label className="text-xl font-semibold">{category.name}</Label>

          <div>
            {category.SubCategories.length &&
              category.SubCategories.map((sub) => (
                <div
                  key={sub.sub_category_id}
                  className="w-56 h-56 relative rounded-md overflow-hidden"
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_API_ENDPOINT + sub.icon_url}
                    alt={sub.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CityServiceCategories;
