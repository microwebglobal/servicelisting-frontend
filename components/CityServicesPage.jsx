"use client";

import React, { useState, useEffect } from 'react';
import { serviceAPI } from '@/api/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronRight, Package, Wrench } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Helper Components
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

const PackageDetails = ({ pkg, addToCart }) => {
  const [packageItems, setPackageItems] = useState([]);

  useEffect(() => {
    const fetchPackageItems = async () => {
      try {
        const response = await serviceAPI.getPackageItems(pkg.package_id);
        setPackageItems(response.data);
      } catch (error) {
        console.error('Error fetching package items:', error);
      }
    };
    fetchPackageItems();
  }, [pkg.package_id]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h6 className="font-medium">{pkg.name}</h6>
          <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
          {packageItems.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Package Includes:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {packageItems.map((item) => (
                  <li key={item.item_id}>{item.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="text-lg font-bold">₹{pkg.base_price}</span>
          <Button 
            size="sm" 
            className="mt-2"
            onClick={() => addToCart(pkg, 'package')}
          >
            Add Package to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

const CartPreview = ({ cart, removeFromCart }) => (
  <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
    <div className="flex items-center gap-2 mb-2">
      <ShoppingCart />
      <span className="font-bold">Cart ({cart.length} items)</span>
    </div>
    {cart.length > 0 && (
      <div className="max-h-60 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.item_id} className="flex justify-between items-center gap-4 mb-2">
            <span className="text-sm">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">₹{item.finalPrice || item.base_price}</span>
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
            <span>₹{cart.reduce((sum, item) => sum + Number(item.finalPrice || item.base_price), 0)}</span>
          </div>
          <Button className="w-full mt-2">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    )}
  </div>
);

const CityServicesPage = ({ cityName }) => {
  // State Management
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

  // Fetch City ID on mount
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
  }, [cityName]);

  // Fetch Initial Data
  useEffect(() => {
    if (cityId) {
      fetchCategories();
    }
  }, [cityId]);

  // API Calls
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
      ]);

      setServices(prev => ({
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

  // Cart Operations
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

  // Handle Category Selection
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