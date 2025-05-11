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
  const [packagesByServiceType, setPackagesByServiceType] = useState({});
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedServiceItems, setSelectedServiceItems] = useState({});
  const [selectedPackages, setSelectedPackages] = useState({});
  const [selectedPackageItems, setSelectedPackageItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProviderData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        setProvider(user);

        if (!user?.uId) return;

        const response = await providerAPI.getProviderByUserId(user.uId);
        setProviderCategories(response.data?.serviceCategories || []);

        const initialSelectedSubCategories = new Set();
        const initialSelectedServices = {};
        const initialSelectedServiceItems = {};
        const initialSelectedPackages = {};
        const initialSelectedPackageItems = {};

        response.data.providerCategories.forEach((pc) => {
          if (pc.category_id) {
            initialSelectedSubCategories.add(pc.category_id);
          }

          if (pc.service_id) {
            initialSelectedServices[pc.service_id] = true;

            if (pc.item_id) {
              if (!initialSelectedServiceItems[pc.service_id]) {
                initialSelectedServiceItems[pc.service_id] = [];
              }
              initialSelectedServiceItems[pc.service_id].push(pc.item_id);
            }
          }

          if (pc.package_id) {
            initialSelectedPackages[pc.package_id] = true;

            if (pc.item_id) {
              if (!initialSelectedPackageItems[pc.package_id]) {
                initialSelectedPackageItems[pc.package_id] = [];
              }
              initialSelectedPackageItems[pc.package_id].push(pc.item_id);
            }
          }
        });

        setSelectedSubCategories(Array.from(initialSelectedSubCategories));
        setSelectedServices(initialSelectedServices);
        setSelectedServiceItems(initialSelectedServiceItems);
        setSelectedPackages(initialSelectedPackages);
        setSelectedPackageItems(initialSelectedPackageItems);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const handleSubCategoryChange = useCallback(
    async (subCategoryId, isChecked) => {
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

        // Remove any service types, services, and packages associated with this subcategory
        const serviceTypesToRemove = Object.entries(serviceTypesBySubCategory)
          .filter(([_, types]) =>
            types.some((type) => type.sub_category_id === subCategoryId)
          )
          .map(([id]) => id);

        setSelectedServiceTypes((prev) =>
          prev.filter((id) => !serviceTypesToRemove.includes(id))
        );

        setServicesByServiceType((prev) => {
          const newState = { ...prev };
          serviceTypesToRemove.forEach((id) => delete newState[id]);
          return newState;
        });

        setPackagesByServiceType((prev) => {
          const newState = { ...prev };
          serviceTypesToRemove.forEach((id) => delete newState[id]);
          return newState;
        });
      }
    },
    [serviceTypesBySubCategory]
  );

  const handleServiceTypeChange = useCallback(
    async (serviceTypeId, isChecked) => {
      setSelectedServiceTypes((prevSelected) =>
        isChecked
          ? [...prevSelected, serviceTypeId]
          : prevSelected.filter((id) => id !== serviceTypeId)
      );

      if (isChecked) {
        try {
          const [servicesResponse, packagesResponse] = await Promise.all([
            serviceAPI.getServices(serviceTypeId),
            serviceAPI.getPackagesByType(serviceTypeId),
          ]);

          console.log(packagesResponse);

          const serviceTypeName =
            Object.values(serviceTypesBySubCategory)
              .flat()
              .find((type) => type.type_id === serviceTypeId)?.name || "";

          setServicesByServiceType((prevState) => ({
            ...prevState,
            [serviceTypeId]: {
              serviceTypeName,
              services: servicesResponse.data,
            },
          }));

          setPackagesByServiceType((prevState) => ({
            ...prevState,
            [serviceTypeId]: {
              serviceTypeName,
              packages: packagesResponse.data.data,
            },
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setServicesByServiceType((prevState) => {
          const newState = { ...prevState };
          delete newState[serviceTypeId];
          return newState;
        });

        setPackagesByServiceType((prevState) => {
          const newState = { ...prevState };
          delete newState[serviceTypeId];
          return newState;
        });
      }
    },
    [serviceTypesBySubCategory]
  );

  const handleServiceSelection = useCallback(
    (serviceId, checked, serviceItems) => {
      if (!serviceId) {
        console.error("Invalid serviceId:", serviceId);
        return;
      }

      setSelectedServices((prev) => ({
        ...prev,
        [serviceId]: checked,
      }));

      setSelectedServiceItems((prev) => ({
        ...prev,
        [serviceId]: checked ? serviceItems.map((item) => item.item_id) : [],
      }));
    },
    []
  );

  const handleServiceItemSelection = useCallback(
    (serviceId, itemId, checked, totalItems) => {
      if (!serviceId) {
        console.error("Invalid serviceId:", serviceId);
        return;
      }

      setSelectedServiceItems((prev) => {
        const updatedItems = checked
          ? [...(prev[serviceId] || []), itemId]
          : prev[serviceId]?.filter((id) => id !== itemId) || [];

        const isServiceSelected = updatedItems.length === totalItems;

        setSelectedServices((prevServices) => ({
          ...prevServices,
          [serviceId]: isServiceSelected,
        }));

        return {
          ...prev,
          [serviceId]: updatedItems,
        };
      });
    },
    []
  );

  const handlePackageSelection = useCallback(
    (packageId, checked, packageSections) => {
      setSelectedPackages((prev) => ({
        ...prev,
        [packageId]: checked,
      }));

      setSelectedPackageItems((prev) => ({
        ...prev,
        [packageId]: checked
          ? packageSections.reduce((acc, section) => {
              return [...acc, ...section.items.map((item) => item.item_id)];
            }, [])
          : [],
      }));
    },
    []
  );

  const handlePackageItemSelection = useCallback(
    (packageId, sectionId, itemId, checked) => {
      setSelectedPackageItems((prev) => {
        const currentItems = prev[packageId] || [];
        const updatedItems = checked
          ? [...currentItems, itemId]
          : currentItems.filter((id) => id !== itemId);

        // Update package selection if all items are selected/deselected
        const packageData = Object.values(packagesByServiceType)
          .flatMap((st) => st.packages)
          .find((pkg) => pkg.package_id === packageId);

        const totalItems =
          packageData?.sections?.reduce(
            (total, section) => total + section.items.length,
            0
          ) || 0;

        setSelectedPackages((prevPkgs) => ({
          ...prevPkgs,
          [packageId]: updatedItems.length === totalItems,
        }));

        return {
          ...prev,
          [packageId]: updatedItems,
        };
      });
    },
    [packagesByServiceType]
  );

  const handleSubmit = useCallback(async () => {
    if (!provider?.providerId) {
      console.error("No provider ID available");
      return;
    }

    setIsLoading(true);
    try {
      // Clean null values
      const cleanedSelectedServices = { ...selectedServices };
      delete cleanedSelectedServices.null;
      const cleanedSelectedServiceItems = { ...selectedServiceItems };
      delete cleanedSelectedServiceItems.null;
      const cleanedSelectedPackages = { ...selectedPackages };
      delete cleanedSelectedPackages.null;
      const cleanedSelectedPackageItems = { ...selectedPackageItems };
      delete cleanedSelectedPackageItems.null;

      const existingProviderResponse = await providerAPI.getProviderByUserId(
        provider.uId
      );
      const existingProviderData = existingProviderResponse.data;

      const updatedProviderCategories = providerCategories.map((category) => {
        const isModified = category.SubCategories?.some((subCategory) =>
          selectedSubCategories.includes(subCategory.sub_category_id)
        );

        if (isModified) {
          return {
            provider_id: provider.providerId,
            category_id: category.category_id,
            experience_years: 3, // Consider making this configurable
            is_primary: false, // Consider making this configurable
            services: Object.entries(cleanedSelectedServices)
              .filter(([serviceId, isSelected]) => isSelected)
              .map(([serviceId]) => ({
                service_id: serviceId,
                items: cleanedSelectedServiceItems[serviceId]?.map(
                  (itemId) => ({
                    item_id: itemId,
                    price_adjustment: 0, // Consider making this configurable
                  })
                ),
              })),
            packages: Object.entries(cleanedSelectedPackages)
              .filter(([packageId, isSelected]) => isSelected)
              .map(([packageId]) => ({
                package_id: packageId,
                items: cleanedSelectedPackageItems[packageId]?.map(
                  (itemId) => ({
                    item_id: itemId,
                    price_adjustment: 0, // Consider making this configurable
                  })
                ),
              })),
          };
        } else {
          const existingCategory =
            existingProviderData.providerCategories?.find(
              (pc) => pc.category_id === category.category_id
            );
          return (
            existingCategory || {
              provider_id: provider.providerId,
              category_id: category.category_id,
              experience_years: 0,
              is_primary: false,
              services: [],
              packages: [],
            }
          );
        }
      });

      await providerAPI.updateProviderCategory(provider.providerId, {
        categories: updatedProviderCategories,
      });

      alert("Services and packages updated successfully!");
    } catch (error) {
      console.error("Error updating provider categories:", error);
      alert("Failed to update services and packages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    provider,
    providerCategories,
    selectedSubCategories,
    selectedServices,
    selectedServiceItems,
    selectedPackages,
    selectedPackageItems,
  ]);

  if (isLoading && providerCategories.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                {category.SubCategories?.length || 0} Subcategories
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
            Available Services & Packages
          </h2>
          <div className="mt-8">
            {selectedServiceTypes.length > 0 ? (
              selectedServiceTypes.map((serviceTypeId) => (
                <div key={serviceTypeId} className="mb-12">
                  {/* Services Section */}
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    {servicesByServiceType[serviceTypeId]?.serviceTypeName}{" "}
                    Services
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {servicesByServiceType[serviceTypeId]?.services?.map(
                      (service) => {
                        const totalItems = service.ServiceItems?.length || 0;
                        return (
                          <div
                            key={service.service_id}
                            className="bg-white p-6 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 relative"
                          >
                            <div className="absolute top-4 right-4">
                              <input
                                type="checkbox"
                                checked={
                                  selectedServices[service.service_id] || false
                                }
                                onChange={(e) =>
                                  handleServiceSelection(
                                    service.service_id,
                                    e.target.checked,
                                    service.ServiceItems || []
                                  )
                                }
                                className="w-5 h-5 accent-blue-500"
                              />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-gray-900">
                                {service.name}
                              </h4>
                            </div>

                            <div className="border-t pt-3">
                              {service.ServiceItems?.map((item) => (
                                <div
                                  key={item.item_id}
                                  className="flex items-center justify-between py-2"
                                >
                                  <p className="text-gray-800">{item.name}</p>
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedServiceItems[
                                        service.service_id
                                      ]?.includes(item.item_id) || false
                                    }
                                    onChange={(e) =>
                                      handleServiceItemSelection(
                                        service.service_id,
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

                  {/* Packages Section */}
                  <h3 className="text-xl font-bold text-gray-700 mb-4 mt-8">
                    {packagesByServiceType[serviceTypeId]?.serviceTypeName}{" "}
                    Packages
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packagesByServiceType[serviceTypeId]?.packages?.map(
                      (pkg) => (
                        <div
                          key={pkg.package_id}
                          className="bg-white p-6 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 relative"
                        >
                          <div className="absolute top-4 right-4">
                            <input
                              type="checkbox"
                              checked={
                                selectedPackages[pkg.package_id] || false
                              }
                              onChange={(e) =>
                                handlePackageSelection(
                                  pkg.package_id,
                                  e.target.checked,
                                  pkg.sections || []
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
                            {pkg.sections?.map((section) => (
                              <div key={section.section_id} className="mb-4">
                                <h5 className="font-medium text-gray-800 mb-2">
                                  {section.name}
                                </h5>
                                {section.items?.map((item) => (
                                  <div
                                    key={item.item_id}
                                    className="flex items-center justify-between py-1 pl-4"
                                  >
                                    <p className="text-gray-700 text-sm">
                                      {item.name}
                                    </p>
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedPackageItems[
                                          pkg.package_id
                                        ]?.includes(item.item_id) || false
                                      }
                                      onChange={(e) =>
                                        handlePackageItemSelection(
                                          pkg.package_id,
                                          section.section_id,
                                          item.item_id,
                                          e.target.checked
                                        )
                                      }
                                      className="w-4 h-4 accent-green-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No service types selected. Please choose service types to view
                available services and packages.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-3 rounded-full shadow-lg font-bold text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors duration-200 flex items-center`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
};

export default Page;
