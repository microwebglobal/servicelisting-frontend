import React, { useState, useEffect } from "react";
import { serviceAPI } from "@/api/services";
import { useToast } from "@/hooks/use-toast";
import { AlertCircleIcon, ChevronDown, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import Modal from "react-modal";
import { Label } from "../ui/label";
import Image from "next/image";

export function ServiceList({ typeId, cityId, addToCart }) {
  const [services, setServices] = useState([]);
  const [serviceItems, setServiceItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [modalOverview, setModelOverview] = useState(null);
  const [serviceDetail, setServiceDetail] = useState(null);

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
              <div className="flex items-center gap-4">
                <Image
                  src={process.env.NEXT_PUBLIC_API_ENDPOINT + service.icon_url}
                  alt={service.name}
                  width={60}
                  height={60}
                  className="rounded-md object-center aspect-square"
                />

                <div className="space-y-0.5">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <ChevronDown />
            </div>

            {serviceItems[service.service_id] && (
              <div className="grid grid-cols-1 gap-4">
                {serviceItems[service.service_id].map((item) => (
                  <div
                    key={item.item_id}
                    className="bg-muted p-4 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h6
                          className="font-medium"
                          onClick={() => openModal(item.overview)}
                        >
                          {item.name}
                        </h6>

                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>

                          {item.is_home_visit && (
                            <p className="text-sm text-[#5f60b9] flex items-start">
                              <AlertCircleIcon className="mr-2 w-4" />
                              You need to visit service provider to get this
                              service
                            </p>
                          )}

                          {item.advance_percentage > 0 && (
                            <p className="text-[#5f60b9] flex items-start text-sm">
                              <AlertCircleIcon className="mr-2 w-4" />
                              {item.advance_percentage}% Advanced Payment
                              Required
                            </p>
                          )}
                        </div>
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

                    <Button
                      variant="ghost"
                      className="text-[#5f60b9] py-0 px-1 font-semibold"
                      onClick={() => {
                        setIsDetailsOpen(true);
                        setServiceDetail(item.overview);
                      }}
                    >
                      View details
                      <ChevronRight />
                    </Button>
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
          className="m-10 bg-white p-8 rounded-md shadow-xl transform transition-all duration-300 ease-in-out w-2/4 overflow-y-auto max-h-[80vh] max-w-md"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(modalOverview),
            }}
          />
        </Modal>

        <Modal
          isOpen={isDetailsOpen}
          onRequestClose={() => {
            setIsDetailsOpen(false);
            setServiceDetail("");
          }}
          ariaHideApp={false}
          contentLabel="Service Description"
          className="m-10 bg-white p-8 rounded-md shadow-xl transform transition-all duration-300 ease-in-out w-2/4 overflow-y-auto max-h-[80vh] max-w-md"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
        >
          <h4 className="text-xl font-bold mb-4">Service Description</h4>

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(serviceDetail),
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
