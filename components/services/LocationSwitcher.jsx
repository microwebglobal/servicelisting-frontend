"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserLocation } from "@/src/hooks/useUserLocation";
import { serviceAPI } from "@/api/services";

export function LocationSwitcher() {
  const { city } = useUserLocation();
  const [cities, setCities] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    serviceAPI
      .getCities()
      .then((response) => {
        setCities(response.data.map((city) => city.name));
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  useEffect(() => {
    setValue(city);
  }, [city]);

  const handleSelect = (city) => {
    setValue(city);
    setOpen(false);

    document.cookie = `current-location=${encodeURIComponent(
      city
    )}; path=/; max-age=${30 * 24 * 60 * 60}`;

    router.push("/services");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-1 items-center">
            <MapPin className="mr-2 h-4 w-4 text-[#5f60b9]" />
            {value ? value : "Select your city"}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup>
            {cities?.map((city) => (
              <CommandItem key={city} onSelect={() => handleSelect(city)}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city ? "opacity-100" : "opacity-0"
                  )}
                />
                {city}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
