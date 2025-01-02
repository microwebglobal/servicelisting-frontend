import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceList } from "./ServiceList";
import { CartPreview } from "./CartPreview";
import { PackageList } from "./PackageList";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import DOMPurify from "dompurify";
import Modal from "react-modal";

export function SubCategoryDetailsPage({
  cityName,
  categorySlug,
  subCategorySlug,
}) {
  const [subCategory, setSubCategory] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [cityId, setCityId] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [modalDescription, setModelDescription] = useState(null);

  const openModal = (description) => {
    setModelDescription(description);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModelDescription(null);
  };

  useEffect(() => {
    fetchCityId();
  }, [cityName]);

  useEffect(() => {
    if (cityId) {
      fetchSubCategoryDetails();
    }
  }, [subCategorySlug, cityId]);

  const fetchCityId = async () => {
    try {
      const response = await serviceAPI.getCities();
      const city = response.data.find(
        (city) => city.name.toLowerCase() === cityName.toLowerCase()
      );
      if (city) {
        setCityId(city.city_id);
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      toast({
        title: "Error",
        description: "Failed to load city information.",
        variant: "destructive",
      });
    }
  };

  const fetchSubCategoryDetails = async () => {
    try {
      setLoading(true);
      const subCategoryResponse = await serviceAPI.getSubCategoryBySlug(
        subCategorySlug
      );
      const subCategory = subCategoryResponse.data;
      setSubCategory(subCategory);

      const serviceTypesResponse = await serviceAPI.getServiceTypes(
        subCategory.sub_category_id
      );
      setServiceTypes(serviceTypesResponse.data);
    } catch (error) {
      console.error("Error fetching subcategory details:", error);
      toast({
        title: "Error",
        description: "Failed to load subcategory details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/services/${cityName}/${categorySlug}`);
  };

  const addToCart = (item, type) => {
    setCart((prev) => [...prev, { ...item, type }]);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.item_id !== itemId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to {subCategory?.category_name}
          </Button>

          <h1 className="text-4xl font-bold mb-8">{subCategory?.name}</h1>

          <div className="space-y-8">
            {serviceTypes.map((type) => (
              <Card key={type.type_id}>
                <div className="flex justify-between">
                  <CardHeader>
                    <CardTitle>{type.name}</CardTitle>
                  </CardHeader>
                  <Button
                    onClick={() => openModal(type.description)}
                    className="mt-5 mr-5"
                  >
                    View Details
                  </Button>
                </div>

                <CardContent>
                  <ServiceList
                    typeId={type.type_id}
                    cityId={cityId}
                    addToCart={addToCart}
                  />
                  <PackageList
                    typeId={type.type_id}
                    cityId={cityId}
                    addToCart={addToCart}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <CartPreview cart={cart} removeFromCart={removeFromCart} />
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        contentLabel="Service Description"
        className="m-10 bg-white p-8 rounded-md shadow-xl transform transition-all duration-300 ease-in-out w-2/4 overflow-y-auto max-h-[80vh]"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(modalDescription),
          }}
        />
      </Modal>

      <Footer />
    </div>
  );
}
