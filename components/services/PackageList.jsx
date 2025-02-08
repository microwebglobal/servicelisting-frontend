import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import PackageDetails from "../packages/PackageDetails";
import { Skeleton } from "@/components/ui/skeleton";

export function PackageList({ typeId, cityId, addToCart }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeId) {
      fetchPackages();
    }
  }, [typeId]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceAPI.getPackagesByType(typeId);
      
      const packagesData = response.data?.data || response.data;
      
      if (Array.isArray(packagesData)) {
        setPackages(packagesData);
      } else {
        console.error("Unexpected packages data format:", packagesData);
        setPackages([]);
        toast({
          title: "Error",
          description: "Received invalid package data format",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load packages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} />
          <h3 className="text-lg font-medium">Available Packages</h3>
        </div>
        <div className="space-y-4">
          {[1, 2].map((index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 text-center text-red-500 bg-red-50 rounded-lg">
        <p>Failed to load packages. Please try again later.</p>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
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