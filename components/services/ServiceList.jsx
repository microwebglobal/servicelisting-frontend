import React, { useState, useEffect } from "react";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import Modal from "react-modal";

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
                  <div
                    className="flex justify-between items-start"
                    onClick={() => openModal(item.overview)}
                  >
                    <div>
                      <h6 className="font-medium">{item.name}</h6>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <div>
                        {item.advance_percentage > 0 && (
                          <span className="text-red-400 text-sm">
                            {item.advance_percentage}% Advanced Payment Required
                          </span>
                        )}
                      </div>
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
  );
}
