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

const data = [
  {
    imageSrc: "/assets/images/hair_clean.png",
    numberOfReviews: "123",
    price: "5000",
    title: "Hair Treatments",
    rating: 4.5,
    providerName: "Wiz Salon",
    providerAvatar: "/assets/images/hair_clean.png",
  },
  {
    imageSrc: "/assets/images/herobg-2.jpg",
    numberOfReviews: "1392",
    price: "2000",
    title: "Home Repair Service",
    rating: 4,
    providerName: "Abc Home Services",
    providerAvatar: "/assets/images/hair_clean.png",
  },
  {
    imageSrc: "/assets/images/herobg-3.jpg",
    numberOfReviews: "453",
    price: "3000",
    title: "Plumbing Services",
    rating: 3.5,
    providerName: "XYZ Plumbing",
    providerAvatar: "/assets/images/hair_clean.png",
  },
  {
    imageSrc: "/assets/images/herobg-4.jpg",
    numberOfReviews: "673",
    price: "8000",
    title: "Home Cleaning",
    rating: 4.5,
    providerName: "Cleaners Company",
    providerAvatar: "/assets/images/hair_clean.png",
  },
  {
    imageSrc: "/assets/images/herobg-5.jpg",
    numberOfReviews: "123",
    price: "300",
    title: "Salon Services",
    rating: 4.5,
    providerName: "Wiz Salon",
    providerAvatar: "/assets/images/hair_clean.png",
  },
];

export default function FeaturedSection() {
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
          {data.map((item, index) => (
            <CarouselItem
              key={index}
              className="!w-[260px] basis-[260px] shrink-0 scroll-snap-start"
            >
              <div className="p-1">
                <FeaturedCard
                  imageSrc={item.imageSrc}
                  badgeText={item.numberOfReviews}
                  price={item.price}
                  title={item.title}
                  rating={item.rating}
                  providerName={item.providerName}
                  providerAvatar={item.providerAvatar}
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
