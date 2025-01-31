import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceList } from "./ServiceList";
import { PackageList } from "./PackageList";
import { BookingPage } from "./BookingPage";
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
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
    if (showBooking) {
      setShowBooking(false);
    } else {
      router.push(`/services/${cityName}/${categorySlug}`);
    }
  };

  const addToCart = (item, type) => {
    console.log("item", item);

    // If the item type is service_item, handle adding a single item
    if (type === "service_item") {
      const existingItem = selectedItems.find(
        (i) => i.id === item.item_id && i.type === type
      );

      if (existingItem) {
        setSelectedItems(
          selectedItems.map((i) =>
            i.id === item.item_id && i.type === type
              ? { ...i, quantity: (i.quantity || 1) + 1 }
              : i
          )
        );
      } else {
        setSelectedItems([
          ...selectedItems,
          {
            id: item.item_id,
            type: type,
            name: item.name,
            price:
              type === "package_item"
                ? item.finalPrice
                : item.SpecialPricings[0]?.special_price || item.base_price,
            quantity: 1,
          },
        ]);
      }

      toast({
        title: "Added to selection",
        description: `${item.name} has been added to your selection.`,
      });
    }

    // If the item type is package_item, handle adding multiple items
    if (type === "package_item") {
      item.sections.forEach((sec) => {
        const existingItem = selectedItems.find(
          (i) => i.id === sec.itemId && i.type === type
        );

        if (existingItem) {
          setSelectedItems((prevItems) =>
            prevItems.map((i) =>
              i.id === sec.itemId && i.type === type
                ? { ...i, quantity: (i.quantity || 1) + 1 }
                : i
            )
          );
        } else {
          setSelectedItems((prevItems) => [
            ...prevItems,
            {
              pkgName: item.name,
              id: sec.itemId,
              type: type,
              name: sec.item.name,
              price: sec.item.price,
              quantity: 1,
            },
          ]);
        }
      });

      toast({
        title: "Added to selection",
        description: `${item.name} and its package items have been added to your selection.`,
      });
    }
  };

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  const removeFromSelection = (itemId, type) => {
    setSelectedItems(
      selectedItems.filter(
        (item) => !(item.id === itemId && item.type === type)
      )
    );
    toast({
      title: "Removed from selection",
      description: "Item has been removed from your selection.",
    });
  };

  const getUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    console.log(userInfo);
    return userInfo ? userInfo : null;
  };

  const handleProceedToBooking = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description:
          "Please select at least one service or package to continue.",
        variant: "destructive",
      });
      return;
    }
    const userInfo = getUserInfo();

    if (userInfo) {
      setShowBooking(true);
    } else {
      toast({
        title: "Plase Login",
        description: "Please login to palce an order",
        variant: "destructive",
      });
      setTimeout(() => {
        router.push("/login/user");
      }, 2000);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  if (showBooking) {
    return (
      <div>
        <Navbar />
        <BookingPage
          cityName={cityName}
          categorySlug={categorySlug}
          subCategorySlug={subCategorySlug}
          selectedItems={selectedItems}
          onBack={handleBack}
          cityId={cityId}
        />
        <Footer />
      </div>
    );
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
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

            <div className="md:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Selected Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No items selected
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedItems.map((item) => (
                        <div
                          key={`${item.id}-${item.type}`}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>₹{item.price}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeFromSelection(item.id, item.type)
                              }
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <Button
                          className="w-full"
                          onClick={handleProceedToBooking}
                        >
                          Proceed to Booking
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
