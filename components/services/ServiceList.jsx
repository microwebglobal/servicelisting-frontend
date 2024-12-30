import React, { useState, useEffect } from 'react';
import { serviceAPI } from '@/api/services';
import { useToast } from "@/hooks/use-toast";
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServiceList({ typeId, cityId, addToCart }) {
  const [services, setServices] = useState([]);
  const [serviceItems, setServiceItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeId) {
      fetchServices();
    }
  }, [typeId]);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getServices(typeId);
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
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
            const [pricingResponse, specialPricingResponse] = await Promise.all([
              serviceAPI.getCityPricing(item.item_id),
              serviceAPI.getActiveSpecialPricing({ 
                item_id: item.item_id, 
                item_type: 'service_item',
                city_id: cityId 
              })
            ]);
  
            const cityPrice = pricingResponse.data.city_prices?.[cityId];
            const specialPrice = specialPricingResponse.data[0]?.special_price;
  
            return {
              ...item,
              originalPrice: cityPrice || item.base_price,
              finalPrice: specialPrice || cityPrice || item.base_price
            };
          } catch (error) {
            console.error(`Error fetching pricing for item ${item.item_id}:`, error);
            return {
              ...item,
              originalPrice: item.base_price,
              finalPrice: item.base_price
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

  if (loading) {
    return <div className="text-center py-4">Loading services...</div>;
  }

  if (services.length === 0) {
    return <div className="text-center py-4">No services available.</div>;
  }

  return (
    <div className="space-y-6">
      {services.map((service) => (
        <div key={service.service_id} className="space-y-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-indigo-600"
            onClick={() => fetchServiceItems(service.service_id)}
          >
            <Wrench size={16} />
            <h3 className="text-lg font-medium">{service.name}</h3>
          </div>
          
          {serviceItems[service.service_id] && (
            <div className="grid grid-cols-1 gap-4 pl-6">
              {serviceItems[service.service_id].map((item) => (
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
          )}
        </div>
      ))}
    </div>
  );
}