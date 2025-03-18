"use client";
import React, { useEffect, useState } from "react";
import { serviceAPI } from "@/api/services";
import Select from "react-select";
import { providerAPI } from "@api/provider";
import SetLocation from "@components/SetLocation";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

const IndividualProviderInquiryForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    type: "individual",
    name: "",
    email: "",
    mobile: "",
    gender: "",
    business_type: "individual",
    dob: "",
    years_experience: 0,
    categories: [],
    cities: [],
    location: "",
    skills: "",
  });

  const [citiesOptions, setCitiesOpions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [serviceCategoriesOptions, setServiceCategoriesOptions] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await serviceAPI.getCities();
        const cityOptions = response.data.map((city) => ({
          value: city.city_id,
          label: city.name,
        }));
        setCitiesOpions(cityOptions);
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
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchCities();
    fetchServices();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep1 = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email format";
    if (!formData.mobile.match(/^\d{10}$/))
      newErrors.mobile = "Phone number must be 10 digits";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};

    if (formData.years_experience < 1)
      newErrors.years_experience = "Experience must be at least 1 year";
    if (!selectedCities.length) newErrors.cities = "Select at least one city";
    if (!selectedServiceCategories.length)
      newErrors.categories = "Select at least one category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Go to Next Step
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  // Go to Previous Step
  const prevStep = () => setStep((prev) => prev - 1);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2) return;
    const formDataToSend = {
      ...formData,
      cities: selectedCities.map((city) => city.value),
      categories: selectedServiceCategories.map((cat) => cat.value),
      years_experience: 4,
    };

    console.log(formDataToSend);

    try {
      setIsLoading(true);
      await providerAPI.createEnquiry(formDataToSend);
      console.log("Final Form Data:", formDataToSend);
      toast({
        title: "Success!",
        description: "Your inquiry was submitted successfully.",
        variant: "default",
      });
      router.push("/registration/sucess");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.details ||
        "Failed to submit inquiry. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {isLoading && (
        <LoadingScreen message={"Inquiry Application Submitting...."} />
      )}
      <form onSubmit={handleSubmit}>
        {/* Step 1: General Information */}
        {step === 1 && (
          <div>
            <label className="block mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <label className="block mb-2">Gender</label>
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
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}

            <label className="block mb-2">Date Of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {errors.dob && <p className="text-red-500">{errors.dob}</p>}

            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <label className="block mb-2">Phone</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-indigo-500 text-white p-2 rounded mt-4"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Service Details */}
        {step === 2 && (
          <div>
            <label className="block mb-2">Cities/Regions of Service</label>
            <div className="mb-4">
              <Select
                id="cities"
                options={citiesOptions}
                isMulti
                value={selectedCities}
                onChange={setSelectedCities}
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
                required
              />
              {errors.cities && <p className="text-red-500">{errors.cities}</p>}
            </div>

            <label className="block mb-2">Exact Location</label>
            <SetLocation
              location={formData.location}
              setLocation={(newLocation) =>
                setFormData({ ...formData, location: newLocation })
              }
              required
            />

            <label className="block mb-2">Service Categories</label>
            <div className="mb-4">
              <Select
                id="categories"
                options={serviceCategoriesOptions}
                isMulti
                value={selectedServiceCategories}
                onChange={setSelectedServiceCategories}
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
                required
              />
              {errors.categories && (
                <p className="text-red-500">{errors.categories}</p>
              )}
            </div>

            <label className="block mb-2">Years Experiance</label>
            <input
              type="number"
              name="years_experience"
              value={formData.years_experience}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {errors.years_experience && (
              <p className="text-red-500">{errors.years_experience}</p>
            )}

            <label className="block mb-2">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button
              type="button"
              onClick={prevStep}
              className="bg-indigo-500 text-white p-2 rounded mr-2"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default IndividualProviderInquiryForm;
