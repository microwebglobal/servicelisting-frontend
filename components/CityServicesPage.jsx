"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { serviceAPI } from '@/api/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronRight, Package, Wrench } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// ServiceItemsList Component
const ServiceItemsList = ({ items, addToCart }) => (
  <div className="grid grid-cols-1 gap-4 mt-2">
    {items.map((item) => (
      <div 
        key={item.item_id}
        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <h6 className="font-medium">{item.name}</h6>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">₹{item.finalPrice}</span>
              {item.finalPrice !== item.base_price && (
                <span className="text-sm text-gray-500 line-through">₹{item.base_price}</span>
              )}
            </div>
            <Button 
              size="sm" 
              className="mt-2"
              onClick={() => addToCart(item, 'service')}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// PackageDetails Component
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
  }, [pkg, cityId]);

  const fetchPackageSections = async () => {
    try {
      const response = await serviceAPI.getSectionsByPackage(pkg.package_id);
      const sectionsData = response.data || [];
      
      let defaultItemsTotal = 0;
      const initialSelectedItems = {};
      
      // Fetch city-specific pricing for each item
      const sectionsWithPricing = await Promise.all(
        sectionsData.map(async (section) => {
          const itemsWithPricing = await Promise.all(
            (section.PackageItems || []).map(async (item) => {
              try {
                const pricingResponse = await serviceAPI.getCityPricing(item.item_id);
                const cityPrice = pricingResponse.data.city_prices?.[cityId];
                return {
                  ...item,
                  price: cityPrice || item.price
                };
              } catch (error) {
                console.error(`Error fetching pricing for item ${item.item_id}:`, error);
                return item;
              }
            })
          );

          return {
            ...section,
            items: itemsWithPricing.sort((a, b) => a.display_order - b.display_order)
          };
        })
      );
      
      // Calculate initial selections and total
      sectionsWithPricing.forEach(section => {
        const defaultItem = section.items.find(item => item.is_default);
        if (defaultItem) {
          initialSelectedItems[section.section_id] = defaultItem.item_id;
          defaultItemsTotal += Number(defaultItem.price);
        }
      });
      
      const sortedSections = sectionsWithPricing.sort((a, b) => a.display_order - b.display_order);
      
      setSelectedItems(initialSelectedItems);
      setSections(sortedSections);
      setBasePrice(defaultItemsTotal);
      calculateTotal(sortedSections, initialSelectedItems);
    } catch (error) {
      console.error('Error fetching package sections:', error);
      setSections([]);
    }
  };

  const calculateTotal = useMemo(() => {
    return (currentSections, currentSelectedItems = selectedItems) => {
      let total = 0;
      currentSections.forEach(section => {
        const selectedItemId = currentSelectedItems[section.section_id];
        const selectedItem = section.items.find(item => item.item_id === selectedItemId);
        if (selectedItem) {
          total += Number(selectedItem.price);
        }
      });
      setPackageTotal(total);
    };
  }, [selectedItems]);

  useEffect(() => {
    calculateTotal(sections);
  }, [selectedItems, sections, calculateTotal]);

  const handleItemSelection = (sectionId, itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [sectionId]: itemId
    }));
  };

  const handleAddToCart = () => {
    const selectedItemsList = sections.map(section => {
      const selectedItem = section.items.find(
        item => item.item_id === selectedItems[section.section_id]
      );
      return {
        section: section.name,
        item: selectedItem
      };
    });

    const packageWithSelections = {
      ...pkg,
      finalPrice: packageTotal,
      sections: selectedItemsList
    };

    addToCart(packageWithSelections, 'package');
    setIsCustomizing(false);
  };

  const DefaultView = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h6 className="font-medium">{pkg.name}</h6>
          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
          {(pkg.duration_hours > 0 || pkg.duration_minutes > 0) && (
            <p className="text-sm text-gray-600 mt-1">
              Duration: {pkg.duration_hours}h {pkg.duration_minutes}m
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-lg font-bold">₹{basePrice}</span>
            {pkg.original_price && pkg.original_price !== basePrice && (
              <span className="text-sm text-gray-500 line-through">₹{pkg.original_price}</span>
            )}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2" onClick={() => setIsCustomizing(true)}>
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
            onValueChange={(value) => handleItemSelection(section.section_id, value)}
          >
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.item_id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={item.item_id} id={`${section.section_id}-${item.item_id}`} />
                    <Label htmlFor={`${section.section_id}-${item.item_id}`} className="cursor-pointer">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </Label>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">₹{item.price}</span>
                    {item.original_price && item.original_price !== item.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{item.original_price}</span>
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

// CartPreview Component
const CartPreview = ({ cart, removeFromCart }) => {
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.finalPrice || item.base_price), 0);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <ShoppingCart />
          <span className="font-bold">Cart (Empty)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <ShoppingCart />
        <span className="font-bold">Cart ({cart.length} items)</span>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {cart.map((item) => (
          <div 
            key={`${item.item_id}-${item.type}`}
            className="flex justify-between items-center gap-4 mb-2"
          >
            <span className="text-sm">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                ₹{item.finalPrice || item.base_price}
              </span>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => removeFromCart(item.item_id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div className="mt-4 border-t pt-2">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹{cartTotal}</span>
          </div>
          <Button className="w-full mt-2">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main CityServicesPage Component
const CityServicesPage = ({ cityName }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [services, setServices] = useState({});
  const [packages, setPackages] = useState({});
  const [serviceItems, setServiceItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cityId, setCityId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCityId = async () => {
      try {
        const response = await serviceAPI.getCities();
        const city = response.data.find(
          city => city.name.toLowerCase() === cityName.toLowerCase()
        );
        if (city) {
          setCityId(city.city_id);
        }
      } catch (error) {
        console.error('Error fetching city:', error);
        toast({
          title: "Error",
          description: "Failed to load city information.",
          variant: "destructive"
        });
      }
    };
    fetchCityId();
  }, [cityName, toast]);

  useEffect(() => {
    if (cityId) {
      fetchCategories();
    }
  }, [cityId]);

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

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await serviceAPI.getSubCategories(categoryId);
      setSubCategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to load subcategories. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchServiceTypes = async (subCategoryId) => {
    if (!subCategoryId) return;
    try {
      const response = await serviceAPI.getServiceTypes(subCategoryId);
      setServiceTypes(response.data);
    } catch (error) {
      console.error('Error fetching service types:', error);
      toast({
        title: "Error",
        description: "Failed to load service types. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchServices = async (typeId) => {
    if (!typeId) return;
    try {
      const [servicesResponse, packagesResponse] = await Promise.all([
        serviceAPI.getServices(typeId),
        serviceAPI.getPackagesByType(typeId)
      ]);setServices(prev => ({
        ...prev,
        [typeId]: servicesResponse.data
      }));

      setPackages(prev => ({
        ...prev,
        [typeId]: packagesResponse.data
      }));
    } catch (error) {
      console.error('Error fetching services and packages:', error);
      toast({
        title: "Error",
        description: "Failed to load services and packages. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchServiceItems = async (serviceId) => {
    if (!serviceId || !cityId) return;
    try {
      const response = await serviceAPI.getServiceItems(serviceId);
      const items = response.data;
      
      const itemsWithPricing = await Promise.all(
        items.map(async (item) => {
          try {
            const pricingResponse = await serviceAPI.getCityPricing(item.item_id);
            const cityPrice = pricingResponse.data.city_prices?.[cityId];
            return {
              ...item,
              finalPrice: cityPrice || item.base_price,
              base_price: item.base_price
            };
          } catch (error) {
            console.error(`Error fetching pricing for item ${item.item_id}:`, error);
            return {
              ...item,
              finalPrice: item.base_price,
              base_price: item.base_price
            };
          }
        })
      );
  
      setServiceItems(prev => ({
        ...prev,
        [serviceId]: itemsWithPricing
      }));
    } catch (error) {
      console.error('Error fetching service items:', error);
      toast({
        title: "Error",
        description: "Failed to load service items. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addToCart = (item, type) => {
    setCart(prev => [...prev, { ...item, type }]);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.item_id !== itemId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart."
    });
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSubCategories([]);
    } else {
      setSelectedCategory(categoryId);
      fetchSubCategories(categoryId);
    }
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
              <Card key={category.category_id}>
                <CardHeader>
                  <CardTitle 
                    className="text-2xl cursor-pointer hover:text-indigo-600"
                    onClick={() => handleCategoryClick(category.category_id)}
                  >
                    {category.name}
                  </CardTitle>
                </CardHeader>
                
                {selectedCategory === category.category_id && (
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {subCategories.map((subCategory) => (
                        <AccordionItem 
                          key={subCategory.sub_category_id} 
                          value={subCategory.sub_category_id}
                        >
                          <AccordionTrigger
                            onClick={() => fetchServiceTypes(subCategory.sub_category_id)}
                          >
                            {subCategory.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-4">
                              {serviceTypes.map((type) => (
                                <div 
                                  key={type.type_id}
                                  className="py-2"
                                >
                                  <h4 
                                    className="font-medium flex items-center gap-2 cursor-pointer hover:text-indigo-600"
                                    onClick={() => fetchServices(type.type_id)}
                                  >
                                    <ChevronRight size={16} />
                                    {type.name}
                                  </h4>
                                  
                                  {/* Services Section */}
                                  {services[type.type_id]?.map((service) => (
                                    <div 
                                      key={service.service_id}
                                      className="ml-6 mt-4"
                                    >
                                      <div 
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => fetchServiceItems(service.service_id)}
                                      >
                                        <Wrench size={16} />
                                        <h5 className="font-medium">{service.name}</h5>
                                      </div>
                                      
                                      {serviceItems[service.service_id] && (
                                        <ServiceItemsList 
                                          items={serviceItems[service.service_id]}
                                          addToCart={addToCart}
                                        />
                                      )}
                                    </div>
                                  ))}

                                  {/* Packages Section */}
                                  {packages[type.type_id]?.length > 0 && (
                                    <div className="mt-4 ml-6">
                                      <h5 className="font-medium flex items-center gap-2 mb-2">
                                        <Package size={16} />
                                        Available Packages
                                      </h5>
                                      <div className="grid gap-4">
                                        {packages[type.type_id].map((pkg) => (
                                          <PackageDetails 
                                            key={pkg.package_id}
                                            pkg={pkg}
                                            addToCart={addToCart}
                                            cityId={cityId}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      <CartPreview cart={cart} removeFromCart={removeFromCart} />
    </div>
  );
};

export default CityServicesPage;