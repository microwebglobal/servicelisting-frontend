import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { serviceAPI } from '@/api/services';
import { useToast } from "@/hooks/use-toast";
import  PackageDetails  from '../packages/PackageDetails';

export function PackageList({ typeId, cityId, addToCart }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeId) {
      fetchPackages();
    }
  }, [typeId]);

  const fetchPackages = async () => {
    try {
      const response = await serviceAPI.getPackagesByType(typeId);
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading packages...</div>;
  }

  if (packages.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Package size={20} />
        <h3 className="text-lg font-medium">Available Packages</h3>
      </div>
      <div className="grid gap-4">
        {packages.map((pkg) => (
          <PackageDetails 
            key={pkg.package_id}
            pkg={pkg}
            addToCart={addToCart}
            cityId={cityId}
          />
        ))}
      </div>
    </div>
  );
}
