import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { serviceAPI } from '@/api/services';
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoryDetailsPage({ cityName, categorySlug }) {
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategoryDetails();
  }, [categorySlug]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      const categoryResponse = await serviceAPI.getCategoryBySlug(categorySlug);
      const category = categoryResponse.data;
      setCategory(category);
      
      const subCategoriesResponse = await serviceAPI.getSubCategories(category.category_id);
      setSubCategories(subCategoriesResponse.data);
    } catch (error) {
      console.error('Error fetching category details:', error);
      toast({
        title: "Error",
        description: "Failed to load category details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategoryClick = (subCategorySlug) => {
    router.push(`/services/${cityName}/${categorySlug}/${subCategorySlug}`);
  };

  const handleBack = () => {
    router.push(`/services/${cityName}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading category details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBack}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>

        <h1 className="text-4xl font-bold mb-8">
          {category?.name}
        </h1>

        <div className="grid gap-6">
          {subCategories.map((subCategory) => (
            <Card 
              key={subCategory.sub_category_id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSubCategoryClick(subCategory.slug)}
            >
              <CardHeader>
                <CardTitle className="text-xl hover:text-indigo-600">
                  {subCategory.name}
                </CardTitle>
                {subCategory.description && (
                  <p className="text-gray-600 mt-2">{subCategory.description}</p>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
