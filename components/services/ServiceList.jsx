import React, { useState, useEffect } from "react";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { AlertCircleIcon, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import Modal from "react-modal";
import { Label } from "../ui/label";

export function ServiceList({ typeId, cityId, addToCart }) {
  const [services, setServices] = useState([]);
  const [serviceItems, setServiceItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [modalOverview, setModelOverview] = useState(null);

  const openModal = (overview) => {
    setModelOverview(overview);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModelOverview(null);
  };

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
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchServiceItems = async (serviceId) => {
    if (!serviceId || !cityId) return;

    try {
      const response = await serviceAPI.getServiceItems(serviceId, cityId);
      console.log(response.data);
      const items = response.data;

      setServiceItems((prev) => ({
        ...prev,
        [serviceId]: items,
      }));
    } catch (error) {
      console.error("Error fetching service items:", error);
      toast({
        title: "Error",
        description: "Failed to load service items. Please try again.",
        variant: "destructive",
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star size={20} />
        <Label className="text-base">Available Services</Label>
      </div>

      <div className="space-y-5">
        {services.map((service) => (
          <div key={service.service_id} className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer hover:text-indigo-600"
              onClick={() => fetchServiceItems(service.service_id)}
            >
              <p className="font-medium text-sm">{service.name}</p>
              <ChevronDown />
            </div>

            {serviceItems[service.service_id] && (
              <div className="grid grid-cols-1 gap-4">
                {serviceItems[service.service_id].map((item) => (
                  <div key={item.item_id} className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h6
                          className="font-medium"
                          onClick={() => openModal(item.overview)}
                        >
                          {item.name}
                        </h6>

                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {item.SpecialPricings[0] ? (
                            <>
                              <span className="text-lg font-bold">
                                ₹{item.SpecialPricings[0].special_price}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.base_price}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">
                              ₹{item.base_price}
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => addToCart(item, "service_item")}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    {item.is_home_visit && (
                      <p className="text-sm text-[#5f60b9] flex items-center mt-6">
                        <AlertCircleIcon className="mr-2 w-4" />
                        You need to visit service provider to get this service
                      </p>
                    )}

                    {item.advance_percentage > 0 && (
                      <p className="text-[#5f60b9] flex items-center text-sm mt-6">
                        <AlertCircleIcon className="mr-2 w-4" />
                        {item.advance_percentage}% Advanced Payment Required
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

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
              __html: DOMPurify.sanitize(modalOverview),
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
