"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ServiceItemForm = ({ onSubmit, initialData, serviceId }) => {
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    cityPricing: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        base_price: initialData.base_price?.toString() || "",
        cityPricing:
          initialData.CitySpecificPricings?.map((pricing) => ({
            city_id: pricing.city_id,
            price: pricing.price.toString(),
          })) || [],
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCityPricing = () => {
    setFormData((prev) => ({
      ...prev,
      cityPricing: [...prev.cityPricing, { city_id: "", price: "" }],
    }));
  };

  const handleRemoveCityPricing = (index) => {
    setFormData((prev) => ({
      ...prev,
      cityPricing: prev.cityPricing.filter((_, i) => i !== index),
    }));
  };

  const handleCityPricingChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      cityPricing: prev.cityPricing.map((pricing, i) =>
        i === index ? { ...pricing, [field]: value } : pricing
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert string prices to numbers
      const processedData = {
        ...formData,
        item_id: `ITM_${Date.now()}`,
        service_id: serviceId,
        base_price: parseFloat(formData.base_price),
        cityPricing: formData.cityPricing.map((pricing) => ({
          ...pricing,
          price: parseFloat(pricing.price),
        })),
      };

      await onSubmit(processedData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="base_price">Base Price</Label>
          <Input
            id="base_price"
            name="base_price"
            type="number"
            step="0.01"
            value={formData.base_price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>City-Specific Pricing</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCityPricing}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add City Price
            </Button>
          </div>

          {formData.cityPricing.map((pricing, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-4">
                  <div>
                    <Label>City</Label>
                    <Select
                      value={pricing.city_id}
                      onValueChange={(value) =>
                        handleCityPricingChange(index, "city_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricing.price}
                      onChange={(e) =>
                        handleCityPricingChange(index, "price", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCityPricing(index)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
};
