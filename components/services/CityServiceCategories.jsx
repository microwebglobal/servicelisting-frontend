import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceAPI } from '@/api/services';
import { useToast } from "@/hooks/use-toast";

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
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/services/${cityName}/${categorySlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 capitalize">
          Services in {cityName}
        </h1>

        {loading ? (
          <div className="text-center py-8">Loading services...</div>
        ) : (
          <div className="grid gap-6">
            {categories.map((category) => (
              <Card 
                key={category.category_id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCategoryClick(category.slug)}
              >
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
    </div>
  );
}
