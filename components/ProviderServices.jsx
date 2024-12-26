import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/services/`
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (serviceId) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceId)) {
        // Deselect the service
        return prevSelected.filter((id) => id !== serviceId);
      } else {
        // Select the service
        return [...prevSelected, serviceId];
      }
    });
    console.log(selectedServices);
  };

  const handleSubmit = async () => {
    console.log("Submitting Selected Services:", selectedServices);

    try {
      const requests = selectedServices.map((serviceId) => {
        const requestBody = {
          sp_id: localStorage.getItem("spId"),
          service_id: serviceId,
          price: 4500,
          status: "active",
        };

        return axios.post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/proserv/`,
          requestBody
        );
      });

      const responses = await Promise.all(requests);

      console.log(
        "All services submitted successfully:",
        responses.map((res) => res.data)
      );
      router.push("/profile/provider");
    } catch (error) {
      console.error("Error submitting one or more services:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Available Services</h1>
      {services.length === 0 ? (
        <p>Loading services...</p>
      ) : (
        <div>
          <ul className="space-y-2">
            {services.map((service) => (
              <li
                key={service.service_id}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  id={`service-${service.service_id}`}
                  value={service.service_id}
                  checked={selectedServices.includes(service.service_id)}
                  onChange={() => handleSelectService(service.service_id)}
                />
                <label htmlFor={`service-${service.service_id}`}>
                  <span className="font-medium">{service.name}</span>:{" "}
                  {service.description}
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Selected Services
          </button>
        </div>
      )}
    </div>
  );
};

export default ProviderServices;
