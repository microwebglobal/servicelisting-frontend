"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { serviceAPI } from "@/api/services";
import { providerAPI } from "@/api/provider";
import { AlertCircle } from "lucide-react";
import SetLocation from "@components/SetLocation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

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
    location: "",
    categories: [],
    no_of_employee: "",
  });

  const [serviceCategoriesOptions, setServiceCategoriesOptions] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );
  const [error, setError] = useState("");
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

  const validateStep1 = () => {
    if (!formData.business_name || !formData.name || !formData.mobile) {
      setError("Please fill in all required fields");
      return false;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.mobile.replace(/[^0-9]/g, ""))) {
      setError("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.categories || !formData.no_of_employee || !formData.email) {
      setError("Please fill in all required fields");
      return false;
    }
    if (!formData.categories || formData.categories.length === 0) {
      setError("Please select at least one service category");
      return false;
    }

    if (!formData.no_of_employee) {
      setError("Please enter the number of employees");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      setError("");
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setStep(1);
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.data?.error === "Duplicate entry") {
        setError("An account with this email already exists");

        toast({
          title: "Error",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
      } else {
        setError(error.response?.data?.error || "Failed to submit inquiry");
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
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isLoading && (
        <LoadingScreen message={"Inquiry Application Submitting...."} />
      )}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div>
              <label className="block mb-2">Business Name</label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </div>

            <div>
              <label className="block mb-2">Business Type</label>
              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Authorized Person Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </div>

            <div>
              <label className="block mb-2">Authorized Person Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Authorized Person Contact</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-indigo-500 text-white p-2 rounded mt-4"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block mb-2">Business Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </div>

            <div>
              <label className="block mb-2">Business Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </div>

            <div>
              <label className="block mb-2">Business Location</label>
              <SetLocation
                location={formData.location}
                setLocation={(newLocation) =>
                  setFormData({ ...formData, location: newLocation })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-2">Number of Employees</label>
              <input
                type="number"
                name="no_of_employee"
                value={formData.no_of_employee}
                onChange={handleChange}
                required
                min="1"
                className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </div>

            <div>
              <label className="block mb-2">Service Categories</label>
              <Select
                isMulti
                options={serviceCategoriesOptions}
                value={selectedServiceCategories}
                onChange={handleCategoryChange}
                className="basic-multi-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#f3f4f6",
                    borderRadius: "0.375rem",
                    border: state.isFocused ? "2px solid #3b82f6" : "none",
                    boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#6b7280",
                  }),
                }}
                classNamePrefix="select"
              />
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
          </>
        )}
      </form>
    </div>
  );
};

export default BusinessProviderInquiryForm;
