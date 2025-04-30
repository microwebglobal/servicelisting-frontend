import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Bookmark } from "lucide-react";
import FeaturedCard from "@/components/ui/featuredCard";
import { serviceAPI } from "@/api/services";
import { useEffect, useState } from "react";

export default function FeaturedSection({ city }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (city !== "" && city !== "unknown") {
      fetchFeaturedServices(city);
    }
  }, [city]);

  const fetchFeaturedServices = async (city) => {
    try {
      const response = await serviceAPI.getFeaturedServices(city);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Bookmark className="size-6 md:size-8" />
            <Label className="text-lg md:text-2xl font-semibold">
              Featured Services
            </Label>
          </div>

          <p className="text-sm text-muted-foreground hidden md:block">
            A trusted choice offering exceptional value, backed by positive
            reviews and real-world results.
          </p>
        </div>

        <Button
          variant="secondary"
          className="bg-[#5f60b9]/10 text-[#5f60b9] font-semibold h-9 px-3 md:px-4 md:h-10"
        >
          See All
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
          {data?.map((item, index) => (
            <CarouselItem
              key={index}
              className="!w-[260px] basis-[260px] shrink-0 scroll-snap-start"
            >
              <div className="p-1">
                <FeaturedCard
                  imageSrc={
                    process.env.NEXT_PUBLIC_API_ENDPOINT + item.icon_url
                  }
                  badgeText={item.numberOfReviews}
                  price={item.base_price}
                  title={item.name}
                  rating={item.rating}
                  providerName={item.providerName}
                  providerAvatar={item.providerAvatar}
                  description={item.description}
                />
              </div>
            </CarouselItem>
          ))}

          {/* Spacer to prevent early disabling of the Next button */}
          <div className="shrink-0 w-[16px]" />
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
