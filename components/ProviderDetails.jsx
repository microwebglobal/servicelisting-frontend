"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { serviceAPI } from "@/api/services";
import { providerAPI } from "@/api/provider";
import { Button } from "./ui/button";
import { toast } from "@hooks/use-toast";
import { DeleteForeverOutlined } from "@/node_modules/@mui/icons-material";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ProviderDetails = ({
  provider,
  isEditing,
  onCloseDialog,
  onUpdateProvider,
}) => {
  const [serviceProvider, setServiceProvider] = useState({
    business_name: provider?.business_name || "",
    business_type: provider?.business_type || "",
    primary_location: provider?.primary_location || {
      type: "Point",
      coordinates: [0, 0],
    },

    business_registration_number: provider?.business_registration_number || "",
    name: provider?.User?.name || "",
    dob: provider?.User?.dob || "",
    gender: provider?.User?.gender || "",
    qualification: provider?.qualification || "",
    email: provider?.User?.email || "",
    account_status: provider?.User?.account_status || "",
    mobile: provider?.User?.mobile || "",
    whatsapp_number: provider?.whatsapp_number || "",
    emergency_contact_name: provider?.emergency_contact_name || "",
    reference_number: provider?.reference_number || "",
    reference_name: provider?.reference_name || "",
    aadhar_number: provider?.aadhar_number || "",
    pan_number: provider?.pan_number || "",
    languages_spoken: provider?.languages_spoken || [],
    service_radius: provider?.service_radius || "",
    availability_type: provider?.availability_type || "full_time",

    availability_hours: {
      monday: provider?.availability_hours?.monday || {
        start: "09:00",
        end: "18:00",
        isOpen: false,
      },
      tuesday: provider?.availability_hours?.tuesday || {
        start: "09:00",
        end: "18:00",
        isOpen: false,
      },
      wednesday: provider?.availability_hours?.wednesday || {
        start: "09:00",
        end: "18:00",
        isOpen: false,
      },
      thursday: provider?.availability_hours?.thursday || {
        start: "09:00",
        end: "18:00",
        isOpen: false,
      },
      friday: provider?.availability_hours?.friday || {
        start: "09:00",
        end: "18:00",
        isOpen: false,
      },
      saturday: provider?.availability_hours?.saturday || {
        start: "09:00",
        end: "18:00",
        isOpen: false,
      },
      sunday: provider?.availability_hours?.sunday || {
        start: "09:00",
        end: "18:00",
        isOpen: false,
      },
    },
    years_experience: provider?.years_experience || 0,
    specializations: provider?.specializations || [],
    profile_bio: provider?.profile_bio || "",
    social_media_links: {
      facebook: provider?.social_media_links?.facebook || "",
      instagram: provider?.social_media_links?.instagram || "",
      linkedin: provider?.social_media_links?.linkedin || "",
    },
    payment_method: provider?.payment_method || "upi",
    payment_details: {
      upi: {
        id: provider?.payment_details?.upi?.id || "",
        display_name: provider?.payment_details?.upi?.display_name || "",
        phone: provider?.payment_details?.upi?.phone || "",
      },
      bank: {
        name: provider?.payment_details?.bank?.bank_name || "",
        branch: "",
        ifsc: "",
        account_number: provider?.payment_details?.account_number || "",
      },
    },
    categories: (provider?.serviceCategories || []).map((cat) => ({
      category_id: cat.category_id || "",
      name: cat.name,
    })),
    cities: (provider?.serviceCities || []).map((city) => ({
      city_id: city.city_id || "",
      name: city.name,
      service_radius: 0,
      is_primary: false,
    })),
    employees: [],
  });
  const [serviceCategoriesOptions, setServiceCategoriesOptions] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );
  const [serviceCityOptions, setServiceCityOptions] = useState([]);
  const [selectedServiceCities, setSelectedServiceCities] = useState([]);
  const [employeeData, setEmployeeData] = useState(
    provider?.ServiceProviderEmployees
  );

  const lat = serviceProvider.primary_location.coordinates[0];
  const lng = serviceProvider.primary_location.coordinates[1];
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  const handleAddEmployee = () => {
    const newEmployee = {};
    setEmployeeData([...employeeData, newEmployee]);
  };

  const handleEmployeeChange = (e, employeeId) => {
    const { name, value } = e.target;

    const updatedEmployeeData = employeeData.map((emp) =>
      emp.employee_id === employeeId
        ? {
            ...emp,
            User: {
              ...emp.User,
              [name]: value,
            },
            [name]: name in emp ? value : emp[name],
          }
        : emp
    );
    setEmployeeData(updatedEmployeeData);

    setServiceProvider((prevProvider) => ({
      ...prevProvider,
      employees: updatedEmployeeData,
    }));
  };

  const handleRemove = (index) => {
    const updatedEmployees = employeeData.filter(
      (_, empIndex) => empIndex !== index
    );
    setEmployeeData(updatedEmployees);

    setServiceProvider((prevProvider) => ({
      ...prevProvider,
      employees: updatedEmployees,
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedServiceCategories(selectedOptions);
    setServiceProvider((prev) => ({
      ...prev,
      categories: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleCityChange = (selectedOptions) => {
    setSelectedServiceCities(selectedOptions);
    setServiceProvider((prev) => ({
      ...prev,
      cities: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  useEffect(() => {
    if (provider?.serviceCategories) {
      const formattedCategories = provider.serviceCategories.map((cat) => ({
        value: cat.category_id,
        label: cat.name,
      }));
      setSelectedServiceCategories(formattedCategories);
    }

    if (provider?.serviceCities) {
      const formattedCities = provider.serviceCities.map((city) => ({
        value: city.city_id,
        label: city.name,
      }));
      console.log("formatted cities:", formattedCities);
      setSelectedServiceCities(formattedCities);
    }
  }, []);

  console.log(provider);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceAPI.getAllCategories();
        const categoryOptions = response.data.map((cat) => ({
          value: cat.category_id,
          label: cat.name,
        }));
        setServiceCategoriesOptions(categoryOptions);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load service categories");
      }
    };

    const fetchCities = async () => {
      try {
        const response = await serviceAPI.getCities();
        const cityOptions = response.data.map((city) => ({
          value: city.city_id,
          label: city.name,
        }));
        setServiceCityOptions(cityOptions);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setError("Failed to load service cities");
      }
    };

    fetchServices();
    fetchCities();
  }, []);

  const getDisplayValue = (value, defaultValue = "N/A") => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : defaultValue;
    }
    return value || defaultValue;
  };

  const formatLocation = (location) => {
    try {
      if (typeof location === "string") {
        const parsed = JSON.parse(location);
        if (parsed.coordinates) {
          return `${parsed.coordinates[1].toFixed(
            4
          )}, ${parsed.coordinates[0].toFixed(4)}`;
        }
      } else if (location?.coordinates) {
        return `${location.coordinates[1].toFixed(
          4
        )}, ${location.coordinates[0].toFixed(4)}`;
      }
    } catch (e) {
      return location || "No location data";
    }
    return "No location data";
  };

  const handleChange = (field, value) => {
    setServiceProvider((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field, subfield, value) => {
    setServiceProvider((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subfield]: value },
    }));
  };

  const handleEditAvailability = (day, field, value) => {
    setServiceProvider((prev) => {
      const updatedDay = {
        ...prev.availability_hours[day],
        [field]: value,
      };

      if (field === "isOpen" && value === false) {
        updatedDay.start = "00:00";
        updatedDay.end = "00:00";
      }

      return {
        ...prev,
        availability_hours: {
          ...prev.availability_hours,
          [day]: updatedDay,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await providerAPI.updateProviderProfile(
        provider.provider_id,
        serviceProvider
      );
      if (onUpdateProvider) {
        onUpdateProvider(serviceProvider);
      }
      toast({
        title: "Success!",
        description: "Service Provider Details Updated Successfully!",
        variant: "default",
      });
      console.log(response);

      onCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "error",
        variant: "destructive",
      });
      console.error;
      onCloseDialog();
    }
  };

  return (
    <div className="space-y-6 p-4">
      {isEditing ? (
        // Render input fields for editing
        <div>
          <form onSubmit={handleSubmit}>
            {/* General Fields */}
            {provider.business_type === "business" ? (
              <div className="mb-5">
                <h3 className="font-bold text-xl">Business Information</h3>{" "}
                <hr className="mb-5" />
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={serviceProvider.business_name}
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) =>
                      handleChange("business_name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Reg No
                  </label>
                  <input
                    type="text"
                    value={serviceProvider.business_registration_number}
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) =>
                      handleChange(
                        "business_registration_number",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-xl">Genaral Information</h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    AADHR No
                  </label>
                  <input
                    type="text"
                    value={serviceProvider.aadhar_number}
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) =>
                      handleChange("aadhar_number", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    PAN No
                  </label>
                  <input
                    type="text"
                    value={serviceProvider.pan_number}
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) => handleChange("pan_number", e.target.value)}
                  />
                </div>
              </>
            )}

            {provider.business_type === "business" ? (
              <h3 className="font-bold text-xl">Responsible Person Details</h3>
            ) : (
              <h3 className="font-bold text-xl">Personal Details</h3>
            )}
            <hr className="mb-5" />
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={serviceProvider.name}
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="flex gap-5 justify-between">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={serviceProvider.dob}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) => handleChange("dob", e.target.value)}
                  placeholder="Date of Birth"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <input
                  type="text"
                  value={serviceProvider.gender}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) => handleChange("gender", e.target.value)}
                  placeholder="Gender"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Status
                </label>
                <select
                  value={serviceProvider.account_status}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) =>
                    handleChange("account_status", e.target.value)
                  }
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspend</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile No
                </label>
                <input
                  type="text"
                  value={serviceProvider.mobile}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  placeholder="Mobile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Whatsapp No
                </label>
                <input
                  type="text"
                  value={serviceProvider.whatsapp_number}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) =>
                    handleChange("whatsapp_number", e.target.value)
                  }
                  placeholder="whatsapp_number"
                />
              </div>
              <div>
                <div className="flex gap-4">
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <span
                    className={`text-sm font-medium ${
                      provider?.User?.email_verified
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {provider?.User?.email_verified
                      ? "Verified"
                      : "Not Verified"}
                  </span>
                </div>
                <input
                  type="email"
                  value={serviceProvider.email}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email"
                />
              </div>
            </div>
            {serviceProvider.business_type === "individual" && (
              <div className="flex gap-5 justify-between">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experience Years
                  </label>
                  <input
                    type="number"
                    value={serviceProvider.years_experience}
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) =>
                      handleChange("years_experience", e.target.value)
                    }
                    placeholder="Experience In Years"
                  />
                </div>
                <div className="w-3/4">
                  <label className="block text-sm font-medium mb-2">
                    Specializations
                  </label>
                  <input
                    type="text"
                    value={serviceProvider.specializations}
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) =>
                      handleChange("specializations", e.target.value)
                    }
                    placeholder="Specializations"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Qualifications
              </label>
              <textarea
                value={serviceProvider.qualification}
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                onChange={(e) => handleChange("qualification", e.target.value)}
                placeholder="Qualifications"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Bio
              </label>
              <textarea
                value={serviceProvider.profile_bio}
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                onChange={(e) => handleChange("profile_bio", e.target.value)}
                placeholder="Profile Bio"
              />
            </div>

            <div className="flex gap-5 justify-between">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={serviceProvider.payment_method}
                  disabled
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) =>
                    handleChange("payment_method", e.target.value)
                  }
                  placeholder="Payment Method"
                />
              </div>
              {serviceProvider.business_type === "individual" && (
                <div className="w-3/4">
                  <label className="block text-sm font-medium mb-2">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    disabled
                    value={serviceProvider.languages_spoken}
                    className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) =>
                      handleChange("languages_spoken", e.target.value)
                    }
                    placeholder="Languages Spoken"
                  />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold ">Availability Hours</h2>
              <hr />
              <div className="mt-5 bg-gray-100 p-6 rounded-md shadow-md">
                <ul className="space-y-6">
                  {Object.entries(serviceProvider.availability_hours).map(
                    ([day, { start, end, isOpen }]) => (
                      <li key={day} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="text-lg text-gray-800">
                              {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
                              <span
                                className={
                                  isOpen ? "text-green-600" : "text-red-600"
                                }
                              >
                                {isOpen
                                  ? `${start || "00:00"} - ${end || "00:00"}`
                                  : "Closed"}
                              </span>
                            </strong>
                          </div>
                          <button
                            type="button"
                            className={`px-4 py-2 rounded-md font-semibold text-sm ${
                              isOpen
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            onClick={() =>
                              handleEditAvailability(day, "isOpen", !isOpen)
                            }
                          >
                            {isOpen ? "Mark as Closed" : "Mark as Open"}
                          </button>
                        </div>
                        {isOpen && (
                          <div className="flex items-center gap-6">
                            <label className="flex flex-col text-sm font-medium text-gray-600">
                              Start Time:
                              <input
                                type="time"
                                value={start}
                                onChange={(e) =>
                                  handleEditAvailability(
                                    day,
                                    "start",
                                    e.target.value
                                  )
                                }
                                className="mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </label>
                            <label className="flex flex-col text-sm font-medium text-gray-600">
                              End Time:
                              <input
                                type="time"
                                value={end}
                                onChange={(e) =>
                                  handleEditAvailability(
                                    day,
                                    "end",
                                    e.target.value
                                  )
                                }
                                className="mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </label>
                          </div>
                        )}
                        <hr className="border-t border-gray-300" />
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold ">Social Media Links</h2>
              <hr className="mb-5" />
              <div>
                <label className="block text-sm font-medium mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={serviceProvider.social_media_links.facebook}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) =>
                    handleNestedChange(
                      "social_media_links",
                      "facebook",
                      e.target.value
                    )
                  }
                  placeholder="Facebook Link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={serviceProvider.social_media_links.instagram}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) =>
                    handleNestedChange(
                      "social_media_links",
                      "instagram",
                      e.target.value
                    )
                  }
                  placeholder="Instagram Link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Linkdin
                </label>
                <input
                  type="text"
                  value={serviceProvider.social_media_links.linkedin}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) =>
                    handleNestedChange(
                      "social_media_links",
                      "linkedin",
                      e.target.value
                    )
                  }
                  placeholder="LinkedIn Link"
                />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold ">Service Categories</h2>
              <hr className="mb-5" />
              <Select
                isMulti
                options={serviceCategoriesOptions}
                value={selectedServiceCategories}
                onChange={handleCategoryChange}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold ">Service Area</h2>
              <hr className="mb-5" />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Radius
                </label>
                <input
                  type="number"
                  value={serviceProvider.service_radius}
                  className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  onChange={(e) =>
                    handleChange("service_radius", e.target.value)
                  }
                  placeholder="LinkedIn Link"
                />
              </div>

              {serviceProvider.primary_location && (
                <>
                  <label className="block text-sm font-medium mb-2">
                    Provider Location
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-4 mb-5">
                    <div className="mt-3 w-full h-52 rounded-lg overflow-hidden shadow-md">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${lat},${lng}`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Cities
                </label>
                <Select
                  isMulti
                  options={serviceCityOptions}
                  value={selectedServiceCities}
                  onChange={handleCityChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            </div>

            {serviceProvider.business_type === "business" && (
              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    Service Provider Employees
                  </h2>

                  <button
                    type="button"
                    onClick={handleAddEmployee}
                    className="bg-black flex space-x-2 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                  >
                    <PlusCircle />
                    <span>Add Employee</span>
                  </button>
                </div>
                <hr className="mb-6 border-gray-300" />

                <div className="p-6">
                  <div className="grid  grid-cols-2 gap-6">
                    {employeeData.map((emp, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 justify-between w-64"
                      >
                        <div className="flex justify-between items-center mb-4 bg-black p-3 rounded-t-xl">
                          <h3 className="text-lg font-semibold text-white">
                            {emp?.User?.name || "New Employee"}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-red-600 hover:text-red-800 transition-all"
                          >
                            <DeleteForeverOutlined />
                          </button>
                        </div>

                        <div className="flex flex-col gap-4 p-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Employee Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={emp?.User?.name || ""}
                              onChange={(e) =>
                                handleEmployeeChange(e, emp.employee_id)
                              }
                              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>
                          <div>
                            <div className="flex gap-5">
                              <label className="block text-sm font-medium mb-2">
                                Employee Email
                              </label>
                              <span
                                className={`text-xs ${
                                  emp?.User?.email_verified
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {emp?.User?.email_verified
                                  ? "Verified"
                                  : "Not Verified"}
                              </span>
                            </div>
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={emp?.User?.email || ""}
                              onChange={(e) =>
                                handleEmployeeChange(e, emp.employee_id)
                              }
                              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Employee Mobile
                            </label>
                            <input
                              type="text"
                              name="mobile"
                              placeholder="Mobile"
                              value={emp?.User?.mobile || ""}
                              onChange={(e) =>
                                handleEmployeeChange(e, emp.employee_id)
                              }
                              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Employee Role
                            </label>
                            <input
                              type="text"
                              name="role"
                              placeholder="Role"
                              value={emp.role || ""}
                              onChange={(e) =>
                                handleEmployeeChange(e, emp.employee_id)
                              }
                              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>{" "}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Employee Qualification
                            </label>
                            <input
                              type="text"
                              name="qualification"
                              placeholder="Qualification"
                              value={emp.qualification || ""}
                              onChange={(e) =>
                                handleEmployeeChange(e, emp.employee_id)
                              }
                              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Yers Experiance
                            </label>
                            <input
                              type="number"
                              name="years_experience"
                              placeholder="Years of Experience"
                              value={emp.years_experience || 0}
                              onChange={(e) =>
                                handleEmployeeChange(e, emp.employee_id)
                              }
                              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Gender
                            </label>
                            <select
                              name="gender"
                              value={emp?.User?.gender || ""}
                              onChange={(e) =>
                                handleEmployeeChange(e, emp.employee_id)
                              }
                              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            >
                              <option value="" disabled>
                                Select Gender
                              </option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="mt-10 w-full py-2 px-4 rounded-m transition-colors disabled:bg-blue-300"
            >
              Edit
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold border-b pb-2">
              {provider.business_type === "business"
                ? "Business Details"
                : "Individual Details"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {getDisplayValue(
                    provider.business_name || provider?.User.name
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">
                  {getDisplayValue(provider.business_type)}
                </p>
              </div>
              {provider.business_type === "individual" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">AAHAR Number</p>
                    <p className="font-medium">
                      {getDisplayValue(provider.aadhar_number)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PAN Number</p>
                    <p className="font-medium">
                      {getDisplayValue(provider.pan_number)}
                    </p>
                  </div>
                </>
              )}
              {provider.business_type === "business" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium">
                      {getDisplayValue(provider.business_registration_number)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold border-b pb-2">
              Contact Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {formatLocation(provider.primary_location)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Whatsapp No</p>
                <p className="font-medium">{provider.whatsapp_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Radius</p>
                <p className="font-medium">{provider.service_radius || 0}km</p>
              </div>
              {provider.languages_spoken && (
                <div>
                  <p className="text-sm text-gray-500">Languages Spoken</p>
                  <p className="font-medium">
                    {getDisplayValue(provider.languages_spoken)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Professional Info */}
          {provider.business_type === "individual" && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Professional Info
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">
                    {provider.years_experience || 0} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Specializations</p>
                  <p className="font-medium">
                    {getDisplayValue(provider.specializations)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="font-medium">
                    {getDisplayValue(provider.qualification)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Service Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold border-b pb-2">
              Service Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-medium capitalize">
                  {getDisplayValue(provider.availability_type)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium uppercase">
                  {getDisplayValue(provider.payment_method)}
                </p>
              </div>
            </div>
          </div>

          {/* provider employees */}
          {provider.ServiceProviderEmployees.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Employee Details
              </h3>

              <div className="grid grid-cols-2 gap-4 ">
                {provider.ServiceProviderEmployees.map((employee) => {
                  return (
                    <div
                      key={employee.employee_id}
                      className="bg-slate-100 p-4 rounded-lg"
                    >
                      {" "}
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 ">Employee Name:</p>
                        <p className="font-medium uppercase">
                          {employee?.User.name}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 ">
                          Employee Mobile:
                        </p>
                        <p className="font-medium uppercase">
                          {employee?.User.mobile}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 ">Employee Id:</p>
                        <p className="font-medium uppercase">
                          {employee.employee_id}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">Employee Role:</p>
                        <p className="font-medium uppercase">
                          {getDisplayValue(employee.role)}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 ">
                          Employee Account Status:
                        </p>
                        <p className="font-medium uppercase">
                          {employee?.User.account_status}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">
                          Employee Status:
                        </p>
                        <p className="font-medium uppercase">
                          {getDisplayValue(employee.status)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderDetails;
