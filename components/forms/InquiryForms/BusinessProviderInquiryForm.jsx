"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { serviceAPI } from "@/api/services";
import { providerAPI } from "@/api/provider";
import SetLocation from "@components/SetLocation";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";

const formDataCacheKey = "BusinessProviderInquiryFormData";

const BusinessProviderInquiryForm = ({ formData, onFormDataChange }) => {
  const [citiesOptions, setCitiesOpions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [serviceCategoriesOptions, setServiceCategoriesOptions] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const businessTypes = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "llc", label: "LLC" },
    { value: "corporation", label: "Corporation" },
    { value: "partnership", label: "Partnership" },
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await serviceAPI.getCities();
        const cityOptions = response.data.map((city) => ({
          value: city.city_id,
          label: city.name,
        }));
        setCitiesOpions(cityOptions);

        // Restore selected cities
        const selectedCityIds = formData.cities;
        if (selectedCityIds.length > 0) {
          const selectedCities = cityOptions.filter((city) =>
            selectedCityIds.includes(city.value)
          );
          setSelectedCities(selectedCities);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await serviceAPI.getAllCategories();
        const categoryOptions = response.data.map((cat) => ({
          value: cat.category_id,
          label: cat.name,
        }));
        setServiceCategoriesOptions(categoryOptions);

        // Restore selected categories
        const selectedCategoryIds = formData.categories;
        if (selectedCategoryIds.length > 0) {
          const selectedCategories = categoryOptions.filter((cat) =>
            selectedCategoryIds.includes(cat.value)
          );
          setSelectedServiceCategories(selectedCategories);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to fetch services.",
          variant: "destructive",
        });
      }
    };

    fetchCities();
    fetchServices();

    // Clear form data cache on page load
    sessionStorage.removeItem(formDataCacheKey);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Show/hide error messages realtime
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.split("_").join(" ")} is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    // Prevent unusual inputs in mobile
    if (name === "mobile") {
      if (value.length > 10) {
        return;
      }
    }

    onFormDataChange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category change
  const handleCategoryChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categories: "",
      }));

      onFormDataChange((prev) => ({
        ...prev,
        categories: selectedOptions.map((option) => option.value),
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categories: "Select at least one category",
      }));
    }

    setSelectedServiceCategories(selectedOptions);
  };

  // Hnadle city change
  const handleCitiesChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cities: "",
      }));

      onFormDataChange((prev) => ({
        ...prev,
        cities: selectedOptions.map((option) => option.value),
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cities: "Select at least one city",
      }));
    }

    setSelectedCities(selectedOptions);
  };

  // Handle location change
  const handleLocationChange = (location) => {
    if (!location) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "Location is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "",
      }));
    }

    onFormDataChange({ ...formData, location: location });
  };

  const validateStep1 = () => {
    let newErrors = {};

    if (!formData.business_name) {
      newErrors.business_name = "Business name is required";
    }

    if (!formData.name) {
      newErrors.name = "Authorized person name is required";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Authorized person contact is required";
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.mobile.replace(/[^0-9]/g, ""))) {
      newErrors.mobile = "Invalid phone number";
    }

    if (formData.gender === "") {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};

    if (!formData.cities.length === 0) {
      newErrors.cities = "Select at least one city";
    }

    if (!formData.categories || formData.categories.length === 0) {
      newErrors.categories = "Select at least one category";
    }

    if (!selectedCities.length) {
      newErrors.cities = "Select at least one city";
    }

    if (!formData.no_of_employee) {
      newErrors.no_of_employee = "Number of employees is required";
    }

    if (!formData.email || formData.email === "") {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = "Invalid email format";
    }

    if (formData.location === "" || formData.location === null) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateStep2()) {
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = {
      type: formData.type,
      business_name: formData.business_name,
      authorized_person_name: formData.name,
      authorized_person_contact: formData.mobile,
      business_type: formData.business_type,
      business_website: formData.website,
      service_location: {
        type: "Point",
        coordinates: formData.location.coordinates,
        address: formData.address,
      },
      categories: formData.categories,
      cities: selectedCities.map((city) => city.value),
      number_of_employees: parseInt(formData.no_of_employee),
      email: formData.email,
      gender: formData.gender,
    };

    try {
      setIsLoading(true);
      const response = await providerAPI.createEnquiry(formDataToSend);

      toast({
        title: "Success!",
        description: "Your inquiry was submitted successfully.",
        variant: "default",
      });

      router.push("/registration/sucess");
      // Reset form
      onFormDataChange({
        type: "business",
        business_name: "",
        name: "",
        mobile: "",
        email: "",
        gender: "",
        business_type: "sole_proprietorship",
        website: "",
        location: { type: "Point", coordinates: [0, 0] },
        address: "",
        categories: [],
        no_of_employee: "",
      });
      setSelectedServiceCategories([]);
      setStep(1);
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.data?.error === "Duplicate entry") {
        toast({
          title: "Error",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
      } else {
        const errorMessage =
          error.response?.data?.details ||
          "Failed to submit inquiry. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {isLoading && (
        <LoadingScreen message={"Inquiry Application Submitting...."} />
      )}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="block">Business Name</label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "border border-red-500 bg-red-500/5 text-red-500":
                      errors.business_name,
                  }
                )}
              />
              {errors.business_name && (
                <p className="text-red-500">{errors.business_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block">Business Type</label>
              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "border border-red-500 bg-red-500/5 text-red-500":
                      errors.business_type,
                  }
                )}
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.business_type && (
                <p className="text-red-500">{errors.business_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block">Authorized Person Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "border border-red-500 bg-red-500/5 text-red-500":
                      errors.name,
                  }
                )}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="block">Authorized Person Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "border border-red-500 bg-red-500/5 text-red-500":
                      errors.gender,
                  }
                )}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <label className="block">Authorized Person Contact</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "border border-red-500 bg-red-500/5 text-red-500":
                      errors.mobile,
                  }
                )}
              />
              {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-indigo-500 text-white p-2 rounded mt-4"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="block">Business Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block">Business Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "border border-red-500 bg-red-500/5 text-red-500":
                      errors.email,
                  }
                )}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="block">Cities/Regions of Service</label>
              <Select
                id="cities"
                options={citiesOptions}
                isMulti
                value={selectedCities}
                onChange={handleCitiesChange}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: errors.cities
                      ? "rgba(239, 68, 68, 0.05)"
                      : "#f3f4f6",
                    borderRadius: "0.375rem",
                    border: state.isFocused
                      ? "2px solid #3b82f6"
                      : errors.cities
                      ? "1px solid #ef4444"
                      : "none",
                    boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#6b7280",
                  }),
                }}
              />
              {errors.cities && <p className="text-red-500">{errors.cities}</p>}
            </div>

            <div className="space-y-2">
              <label className="block">Business Location</label>
              <SetLocation
                className={cn({
                  "border border-red-500 bg-red-500/5 text-red-500":
                    errors.location,
                })}
                location={formData.location}
                setLocation={handleLocationChange}
              />
              {errors.location && (
                <p className="text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block">Number of Employees</label>
              <input
                type="number"
                name="no_of_employee"
                value={formData.no_of_employee}
                onChange={handleChange}
                min="1"
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "border border-red-500 bg-red-500/5 text-red-500":
                      errors.no_of_employee,
                  }
                )}
              />
              {errors.no_of_employee && (
                <p className="text-red-500">{errors.no_of_employee}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block">Service Categories</label>
              <Select
                isMulti
                options={serviceCategoriesOptions}
                value={selectedServiceCategories}
                onChange={handleCategoryChange}
                className="basic-multi-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: errors.categories
                      ? "rgba(239, 68, 68, 0.05)"
                      : "#f3f4f6",
                    borderRadius: "0.375rem",
                    border: state.isFocused
                      ? "2px solid #3b82f6"
                      : errors.categories
                      ? "1px solid #ef4444"
                      : "none",
                    boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#6b7280",
                  }),
                }}
                classNamePrefix="select"
              />
              {errors.categories && (
                <p className="text-red-500">{errors.categories}</p>
              )}
            </div>

            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="bg-indigo-500 text-white p-2 rounded mr-2"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 text-white p-2 rounded"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BusinessProviderInquiryForm;
