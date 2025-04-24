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

export default function FeaturedSection() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Bookmark className="size-8" />
            <Label className="text-2xl font-semibold">Featured Services</Label>
          </div>

          <p className="text-sm text-muted-foreground">
            A trusted choice offering exceptional value, backed by positive
            reviews and real-world results.
          </p>
        </div>

        <Button
          variant="secondary"
          className="bg-[#5f60b9]/10 text-[#5f60b9] font-semibold"
        >
          See All
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
  );
}
