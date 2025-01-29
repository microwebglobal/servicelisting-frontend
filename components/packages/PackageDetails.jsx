import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Package, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { serviceAPI } from "../../api/services";

const PackageDetails = ({ pkg, addToCart, cityId }) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [packageTotal, setPackageTotal] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  useEffect(() => {
    if (pkg) {
      fetchPackageSections();
    }
  }, [pkg]);

  const fetchPackageSections = async () => {
    try {
      const response = await serviceAPI.getSectionsByPackage(pkg.package_id);
      const sectionsData = response.data || [];

      console.log(response.data);

      // Initialize variables for tracking default selections and total
      let defaultItemsTotal = 0;
      const initialSelectedItems = {};

      // Fetch city-specific pricing and special pricing for each item
      const sectionsWithPricing = await Promise.all(
        sectionsData.map(async (section) => {
          const itemsWithPricing = await Promise.all(
            (section.PackageItems || []).map(async (item) => {
              const cityPrice = item.CitySpecificPricings?.find(
                (pricing) => pricing.city_id === cityId
              )?.price;
              const specialPrice = item.SpecialPricings?.find(
                (pricing) => pricing.city_id === cityId
              )?.special_price;

              return {
                ...item,
                originalPrice: cityPrice || item.price,
                price: specialPrice || cityPrice || item.price,
              };
            })
          );

          return {
            ...section,
            items: itemsWithPricing.sort(
              (a, b) => a.display_order - b.display_order
            ),
          };
        })
      );

      // Calculate initial selections and total
      sectionsWithPricing.forEach((section) => {
        const defaultItem = section.items.find((item) => item.is_default);
        if (defaultItem) {
          initialSelectedItems[section.section_id] = defaultItem.item_id;
          defaultItemsTotal += Number(defaultItem.price);
        }
      });

      // Sort sections by display_order
      const sortedSections = sectionsWithPricing.sort(
        (a, b) => a.display_order - b.display_order
      );

      setSelectedItems(initialSelectedItems);
      setSections(sortedSections);
      setBasePrice(defaultItemsTotal);
      calculateTotal(sortedSections, initialSelectedItems);
    } catch (error) {
      console.error("Error fetching package sections:", error);
      setSections([]);
    }
  };

  const calculateTotal = (
    currentSections,
    currentSelectedItems = selectedItems
  ) => {
    let total = 0;
    currentSections.forEach((section) => {
      const selectedItemId = currentSelectedItems[section.section_id];
      const selectedItem = section.items.find(
        (item) => item.item_id === selectedItemId
      );
      if (selectedItem) {
        total += Number(selectedItem.price);
      }
    });
    setPackageTotal(total);
  };

  useEffect(() => {
    calculateTotal(sections);
  }, [selectedItems, sections]);

  const handleItemSelection = (sectionId, itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [sectionId]: itemId,
    }));
  };

  const handleAddToCart = () => {
    const selectedItemsList = sections.map((section) => {
      const selectedItem = section.items.find(
        (item) => item.item_id === selectedItems[section.section_id]
      );

      return {
        section: section.name,
        item: selectedItem,
        itemId: selectedItem.item_id,
      };
    });

    console.log(selectedItemsList);
    const packageWithSelections = {
      ...pkg,
      finalPrice: packageTotal,
      sections: selectedItemsList,
    };

    addToCart(packageWithSelections, "package_item");
    setIsCustomizing(false);
  };

  const DefaultView = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h6 className="font-medium">{pkg.name}</h6>
          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
          {(pkg.duration_hours > 0 || pkg.duration_minutes) > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Service Duration: {pkg.duration_hours}h {pkg.duration_minutes}m
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-lg font-bold">₹{basePrice}</span>
            {selectedItems.price &&
              selectedItems.original_price !== basePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{selectedItems.original_price}
                </span>
              )}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => setIsCustomizing(true)}
              >
                Customize Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Customize {pkg.name}</DialogTitle>
              </DialogHeader>
              <CustomizationView />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );

  const CustomizationView = () => (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.section_id} className="border-b pb-4">
          <h3 className="font-medium mb-2">{section.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{section.description}</p>

          <RadioGroup
            value={selectedItems[section.section_id]}
            onValueChange={(value) =>
              handleItemSelection(section.section_id, value)
            }
          >
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.item_id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={item.item_id} id={item.item_id} />
                    <Label htmlFor={item.item_id} className="cursor-pointer">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">₹{item.price}</span>
                    {item.originalPrice &&
                      item.originalPrice !== item.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{item.originalPrice}
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      ))}

      <div className="sticky bottom-0 bg-white p-4 border-t mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total</span>
          <span className="text-xl font-bold">₹{packageTotal}</span>
        </div>
        <Button className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );

  return isCustomizing ? <CustomizationView /> : <DefaultView />;
};

export default PackageDetails;
