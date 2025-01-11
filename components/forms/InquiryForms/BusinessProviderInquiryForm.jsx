"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { serviceAPI } from "@/api/services";
import { providerAPI } from "@/api/provider";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BusinessProviderInquiryForm = () => {
  const [formData, setFormData] = useState({
    type: "business",
    business_name: "",
    name: "", // Authorized Person Name
    mobile: "", // Authorized Person Contact
    email: "",
    gender: "", // Authorized Person Gender
    business_type: "sole_proprietorship",
    website: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    address: "", // New field for full address
    categories: [],
    no_of_employee: "",
  });

  const [serviceCategoriesOptions, setServiceCategoriesOptions] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "llc", label: "LLC" },
    { value: "corporation", label: "Corporation" },
    { value: "partnership", label: "Partnership" },
  ];

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

    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedServiceCategories(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      categories: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const validateForm = () => {
    if (
      !formData.business_name ||
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.address ||
      !formData.no_of_employee
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!formData.categories || formData.categories.length === 0) {
      setError("Please select at least one service category");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.mobile.replace(/[^0-9]/g, ""))) {
      setError("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!validateForm()) {
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
      number_of_employees: parseInt(formData.no_of_employee),
      email: formData.email,
      gender: formData.gender,
    };

    try {
      const response = await providerAPI.createEnquiry(formDataToSend);
      alert("Business inquiry submitted successfully!");
      // Reset form
      setFormData({
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
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.data?.error === "Duplicate entry") {
        setError("An account with this email already exists");
      } else {
        setError(error.response?.data?.error || "Failed to submit inquiry");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Business Provider Registration
      </h2>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Business Name *
          </label>
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Business Type *
          </label>
          <select
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {businessTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Authorized Person Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Authorized Person Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Business Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Authorized Person Contact *
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Business Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Business Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Employees *
          </label>
          <input
            type="number"
            name="no_of_employee"
            value={formData.no_of_employee}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Service Categories *
          </label>
          <Select
            isMulti
            options={serviceCategoriesOptions}
            value={selectedServiceCategories}
            onChange={handleCategoryChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
};

export default BusinessProviderInquiryForm;
