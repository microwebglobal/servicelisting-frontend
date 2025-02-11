"use client";
import { providerAPI } from "@/api/provider";
import { serviceAPI } from "@/api/services";
import React, { useEffect, useState, useCallback } from "react";

const Page = () => {
  const [provider, setProvider] = useState(null);
  const [providerCategories, setProviderCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [serviceTypesBySubCategory, setServiceTypesBySubCategory] = useState(
    {}
  );
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [servicesByServiceType, setServicesByServiceType] = useState({});
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedServiceItems, setSelectedServiceItems] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    setProvider(user);

    if (!user?.uId) return;

    const fetchProviderCategories = async () => {
      try {
        const response = await providerAPI.getProviderByUserId(user.uId);
        setProviderCategories(response.data?.serviceCategories || []);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchProviderCategories();
  }, []);

  const handleSubCategoryChange = async (subCategoryId, isChecked) => {
    setSelectedSubCategories((prevSelected) =>
      isChecked
        ? [...prevSelected, subCategoryId]
        : prevSelected.filter((id) => id !== subCategoryId)
    );

    if (isChecked) {
      try {
        const response = await serviceAPI.getServiceTypes(subCategoryId);
        setServiceTypesBySubCategory((prevState) => ({
          ...prevState,
          [subCategoryId]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    } else {
      setServiceTypesBySubCategory((prevState) => {
        const newState = { ...prevState };
        delete newState[subCategoryId];
        return newState;
      });
    }
  };

  const handleServiceTypeChange = async (serviceTypeId, isChecked) => {
    setSelectedServiceTypes((prevSelected) =>
      isChecked
        ? [...prevSelected, serviceTypeId]
        : prevSelected.filter((id) => id !== serviceTypeId)
    );

    if (isChecked) {
      try {
        const response = await serviceAPI.getServices(serviceTypeId);

        const serviceTypeName =
          Object.values(serviceTypesBySubCategory)
            .flat()
            .find((type) => type.type_id === serviceTypeId)?.name || "";

        setServicesByServiceType((prevState) => ({
          ...prevState,
          [serviceTypeId]: {
            serviceTypeName,
            services: response.data,
          },
        }));
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    } else {
      setServicesByServiceType((prevState) => {
        const newState = { ...prevState };
        delete newState[serviceTypeId];
        return newState;
      });
    }
  };

  const handleServiceSelection = (serviceId, checked, serviceItems) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: checked,
    }));

    setSelectedServiceItems((prev) => ({
      ...prev,
      [serviceId]: checked ? serviceItems.map((item) => item.item_id) : [],
    }));
  };

  const handleServiceItemSelection = (
    serviceId,
    itemId,
    checked,
    totalItems
  ) => {
    setSelectedServiceItems((prev) => {
      const updatedItems = checked
        ? [...(prev[serviceId] || []), itemId]
        : prev[serviceId]?.filter((id) => id !== itemId) || [];

      const isServiceSelected = updatedItems.length === totalItems;

      setSelectedServices((prev) => ({
        ...prev,
        [serviceId]: isServiceSelected,
      }));

      return {
        ...prev,
        [serviceId]: updatedItems,
      };
    });
  };

  const handleSubmit = async () => {
    const response = providerCategories
      .filter((category) =>
        category.SubCategories.some((subCategory) =>
          selectedSubCategories.includes(subCategory.sub_category_id)
        )
      )
      .map((category) => {
        const selectedSubCategory = category.SubCategories.find((subCategory) =>
          selectedSubCategories.includes(subCategory.sub_category_id)
        );

        return {
          id: category.category_id,
          experience_years: 3,
          is_primary: false,
          services: Object.entries(selectedServices)
            .filter(([serviceId, isSelected]) => isSelected)
            .map(([serviceId]) => {
              const service = Object.values(servicesByServiceType)
                .flatMap((serviceType) => serviceType.services)
                .find((pkg) => pkg.service_id === parseInt(serviceId));

              return {
                id: serviceId,
                items: selectedServiceItems[serviceId]?.map((itemId) => {
                  const item = service?.ServiceItems.find(
                    (item) => item.item_id === itemId
                  );
                  return {
                    id: itemId, // Item ID
                  };
                }),
              };
            }),
        };
      });

    try {
      await providerAPI.updateProviderCategory(provider?.providerId, response);
    } catch (error) {
      console.error();
    }
    console.log("Formatted Response:", response);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl ml-10 font-bold text-gray-800">
        Configure Your Services
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {providerCategories.map((category) => (
          <div
            key={category.category_id}
            className="bg-white p-6 shadow-lg rounded-lg transition-transform transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-700">
                {category.name}
              </h2>
              <span className="text-sm text-gray-500">
                {category.SubCategories?.length} Subcategories
              </span>
            </div>
            <ul className="mt-4 space-y-4">
              {category.SubCategories?.map((subCategory) => (
                <li
                  key={subCategory.sub_category_id}
                  className="border-b border-gray-200 pb-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-lg text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(
                          subCategory.sub_category_id
                        )}
                        onChange={(e) =>
                          handleSubCategoryChange(
                            subCategory.sub_category_id,
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 text-indigo-600"
                      />
                      <span className="ml-2">{subCategory.name}</span>
                    </label>
                  </div>
                  {serviceTypesBySubCategory[subCategory.sub_category_id] && (
                    <div className="mt-3 pl-6">
                      {serviceTypesBySubCategory[
                        subCategory.sub_category_id
                      ].map((serviceType) => (
                        <div
                          key={serviceType.type_id}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServiceTypes.includes(
                              serviceType.type_id
                            )}
                            onChange={(e) =>
                              handleServiceTypeChange(
                                serviceType.type_id,
                                e.target.checked
                              )
                            }
                            className="h-5 w-5 text-indigo-600"
                          />
                          <label className="text-md text-gray-500">
                            {serviceType.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-2xl mt-12 font-semibold text-gray-800">
            Available Services
          </h2>
          <div className="mt-8">
            {selectedServiceTypes.length > 0 ? (
              selectedServiceTypes.map((serviceTypeId) => (
                <div key={serviceTypeId} className="mb-12">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    {servicesByServiceType[serviceTypeId]?.serviceTypeName}{" "}
                    Services
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {servicesByServiceType[serviceTypeId]?.services.map(
                      (pkg) => {
                        const totalItems = pkg.ServiceItems.length;
                        return (
                          <div
                            key={pkg.service_id}
                            className="bg-white p-6 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 relative"
                          >
                            <div className="absolute top-4 right-4">
                              <input
                                type="checkbox"
                                checked={
                                  selectedServices[pkg.service_id] || false
                                }
                                onChange={(e) =>
                                  handleServiceSelection(
                                    pkg.service_id,
                                    e.target.checked,
                                    pkg.ServiceItems
                                  )
                                }
                                className="w-5 h-5 accent-blue-500"
                              />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-gray-900">
                                {pkg.name}
                              </h4>
                            </div>

                            <div className="border-t pt-3">
                              {pkg.ServiceItems.map((item) => (
                                <div
                                  key={item.item_id}
                                  className="flex items-center justify-between py-2"
                                >
                                  <p className="text-gray-800">{item.name}</p>
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedServiceItems[
                                        pkg.service_id
                                      ]?.includes(item.item_id) || false
                                    }
                                    onChange={(e) =>
                                      handleServiceItemSelection(
                                        pkg.service_id,
                                        item.item_id,
                                        e.target.checked,
                                        totalItems
                                      )
                                    }
                                    className="w-4 h-4 accent-green-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No service types selected. Please choose service types to view
                available packages.
              </p>
            )}
          </div>
        </div>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Page;
