"use client";
import { providerAPI } from "@/api/provider";
import { serviceAPI } from "@/api/services";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

const Page = () => {
  const [provider, setProvider] = useState(null);
  const [providerCategories, setProviderCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [serviceTypesBySubCategory, setServiceTypesBySubCategory] = useState(
    {}
  );
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [packagesByServiceType, setPackagesByServiceType] = useState([]);

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
        const response = await serviceAPI.getPackagesByType(serviceTypeId);
        console.log(response.data.data);
        setPackagesByServiceType((prevState) => ({
          ...prevState,
          [serviceTypeId]: response.data.data,
        }));
        console.log(serviceTypesBySubCategory);
        console.log(packagesByServiceType);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    } else {
      setPackagesByServiceType((prevState) => {
        const newState = { ...prevState };
        delete newState[serviceTypeId];
        return newState;
      });
    }
  };

  const allServiceTypes = Object.values(serviceTypesBySubCategory).flat();
  const allPackages = Object.values(packagesByServiceType).flat();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl mt-12 font-semibold text-gray-800">
            Available Packages{" "}
            {selectedServiceTypes.length > 0 && (
              <Button className="ml-10">
                <FaEdit />
                Create Custom Package
              </Button>
            )}
          </h2>
          <div className="mt-8">
            {selectedServiceTypes.length > 0 ? (
              selectedServiceTypes.map((serviceTypeId) => (
                <div key={serviceTypeId} className="mb-12">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    {
                      packagesByServiceType[serviceTypeId]?.[0]?.ServiceType
                        ?.name
                    }{" "}
                    Packages
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packagesByServiceType[serviceTypeId]?.map((pkg) => (
                      <div
                        key={pkg.package_id}
                        className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {pkg.name}
                          </h4>
                        </div>
                      </div>
                    ))}
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
        <div>
          <h2 className="text-2xl mt-12 font-semibold text-gray-800">
            Available Services{" "}
            {selectedServiceTypes.length > 0 && (
              <Button className="ml-10">
                <FaEdit />
                Create Custom Service
              </Button>
            )}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Page;
