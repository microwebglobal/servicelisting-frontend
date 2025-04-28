import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceList } from "./ServiceList";
import { PackageList } from "./PackageList";
import { BookingPage } from "./BookingPage";
import DOMPurify from "dompurify";
import Modal from "react-modal";
import { Label } from "../ui/label";

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
      router.push(`/services/${cityName}/`);
    }
  };

  const addToCart = (item, type) => {
    console.log("item", selectedItems);
    // Check if any selected item is a home visit or non-home visit
    const hasHomeVisitItem = selectedItems.some(
      (i) => i.is_home_visit === true
    );
    const hasNonHomeVisitItem = selectedItems.some(
      (i) => i.is_home_visit === false
    );
    const isNewItemHomeVisit = item.is_home_visit === true;

    // Restrict adding items of different types (home visit vs. non-home visit)
    if (
      (hasHomeVisitItem && !isNewItemHomeVisit) ||
      (hasNonHomeVisitItem && isNewItemHomeVisit)
    ) {
      toast({
        title: "Selection Restriction",
        description:
          "You can only select either home visit or non-home visit items, not both.",
        status: "error",
      });
      return;
    }

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
            duration_hours: item.duration_hours,
            duration_minutes: item.duration_minutes,
            name: item.name,
            price:
              type === "package_item"
                ? item.finalPrice
                : item.SpecialPricings[0]?.special_price || item.base_price,
            quantity: 1,
            is_home_visit: item.is_home_visit,
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
              is_home_visit: item.is_home_visit,
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
        <BookingPage
          cityName={cityName}
          categorySlug={categorySlug}
          subCategorySlug={subCategorySlug}
          selectedItems={selectedItems}
          onBack={handleBack}
          cityId={cityId}
        />
      </div>
    );
  }

  return (
    <>
      <div className="px-6 md:px-8 sm:pt-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="mb-2 p-0 hover:bg-transparent hover:text-muted-foreground"
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4" />
            Back{" "}
            {subCategory?.category_name
              ? `to ${subCategory.category_name}`
              : ""}
          </Button>

          <h1 className="text-4xl font-bold mb-8">{subCategory?.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {serviceTypes.map((type) => (
                <div key={type.type_id} className="space-y-5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xl font-semibold">{type.name}</Label>

                    <Button
                      variant="secondary"
                      onClick={() => openModal(type.description)}
                      className="bg-[#5f60b9]/10 text-[#5f60b9] font-semibold"
                    >
                      View Details
                    </Button>
                  </div>

                  <div className="p-5 space-y-10 border rounded-lg">
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
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-28">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart />
                    Cart
                  </CardTitle>
                </CardHeader>

                <CardContent className="pl-7">
                  {selectedItems.length === 0 ? (
                    <p className="text-gray-500 text-center pt-4 pb-8">
                      No items selected
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedItems.map((item) => (
                        <div
                          key={`${item.id}-${item.type}`}
                          className="flex justify-between items-center"
                        >
                          <div className="w-full">
                            <div className="flex justify-between">
                              <p className="font-medium text-base">
                                {item.name}
                              </p>

                              <span>₹{item.price}</span>
                            </div>

                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="-mt-6"
                            onClick={() =>
                              removeFromSelection(item.id, item.type)
                            }
                          >
                            ✕
                          </Button>
                        </div>
                      ))}

                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="font-semibold text-lg text-[#5f60b9]">
                            Total Price
                          </Label>

                          <span className="font-semibold text-lg">
                            ₹
                            {selectedItems
                              .map((item) => item.price * (item.quantity || 1))
                              .reduce((a, b) => a + b, 0)}
                          </span>
                        </div>

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
        className="max-w-md space-y-4 bg-white p-6 rounded-md shadow-xl transform transition-all duration-300 ease-in-out w-2/4 overflow-y-auto max-h-[80vh]"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
      >
        <Label className="text-lg font-semibold">Description</Label>

        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(modalDescription),
          }}
        />
      </Modal>
    </>
  );
}
