"use client";
import React, { useEffect, useState } from "react";
import { serviceAPI } from "@/api/services";
import Select from "react-select";
import { providerAPI } from "@api/provider";
import SetLocation from "@components/SetLocation";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import { CalendarSearch } from "lucide-react";

const IndividualProviderInquiryForm = ({ formData, onFormDataChange }) => {
  const [step, setStep] = useState(1);

  // Calculate minimum age
  const today = new Date();
  const minAgeDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // Calculate maximum age
  const maxAgeDate = new Date(
    today.getFullYear() - 80,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

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
      }
    };

    fetchCities();
    fetchServices();
  }, []);

  // Handle Input Change
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

    // Prevent unusual inputs in dob
    if (name === "dob") {
      const error = isValidDOB(value);
      if (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: error,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: "",
        }));
      }
    }

    // Prevent unusual inputs in years_experience
    if (name === "years_experience") {
      const years = parseInt(value);
      if (years < 0 || years > 80) {
        return;
      }
    }

    // Prevent unusual inputs in mobile
    if (name === "mobile") {
      if (value.length > 10) {
        return;
      }
    }

    onFormDataChange({ ...formData, [name]: value });
  };

  // Handle Location Change
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

  //Handle Seelecte categories change
  const handleSelectedCategoriesChange = (selectedCategories) => {
    if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categories: "",
      }));

      onFormDataChange({
        ...formData,
        categories: selectedCategories.map((category) => category.value),
      });
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categories: "Select at least one category",
      }));
    }

    setSelectedServiceCategories(selectedCategories);
  };

  // Handle Selected Cities Change
  const handleSelectedCitiesChange = (selectedCities) => {
    if (Array.isArray(selectedCities) && selectedCities.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cities: "",
      }));

      onFormDataChange({
        ...formData,
        cities: selectedCities.map((city) => city.value),
      });
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cities: "Select at least one city",
      }));
    }

    setSelectedCities(selectedCities);
  };

  // Validate date of birth
  const isValidDOB = (dob) => {
    const dobDate = new Date(dob);
    if (dobDate > today) return "Birthdate cannot be in the future";

    // Calculate age
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    // Check if birthday occured this year
    const adjustedAge =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0) ? age : age - 1;

    if (adjustedAge < 18 || adjustedAge > 80)
      return "Age must be between 18 and 80";
  };

  const validateStep1 = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email format";
    if (!formData.mobile.match(/^\d{10}$/))
      newErrors.mobile = "Phone number must be 10 digits";
    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const error = isValidDOB(formData.dob);
      if (error) newErrors.dob = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};

    if (formData.years_experience < 1)
      newErrors.years_experience = "Experience must be at least 1 year";
    if (formData.years_experience > 80)
      newErrors.years_experience = "Experience must be less than 80 years";

    if (!selectedCities.length) newErrors.cities = "Select at least one city";
    if (!selectedServiceCategories.length)
      newErrors.categories = "Select at least one category";

    if (formData.location === null || formData.location === "")
      newErrors.location = "Location is required";
    if (formData.skills === "") newErrors.skills = "Skills are required";

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
    if (!validateStep2()) return;

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
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <label className="block">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "bg-red-500/5 border border-red-500/50 text-red-500":
                      errors.name,
                  }
                )}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="block">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "bg-red-500/5 border border-red-500/50 text-red-500":
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
              <label className="block">Date Of Birth</label>

              <div
                className={cn(
                  "flex items-center gap-2 bg-gray-100 px-3 rounded-md focus-within:ring-2 focus-within:ring-blue-500",
                  {
                    "bg-red-500/5 border border-red-500/50 text-red-500":
                      errors.dob,
                  }
                )}
              >
                <CalendarSearch className="size-5" />

                <DatePicker
                  selected={formData.dob || ""}
                  minDate={maxAgeDate}
                  maxDate={minAgeDate}
                  placeholderText="Select a date"
                  onChange={(date) =>
                    handleChange({ target: { name: "dob", value: date } })
                  }
                  wrapperClassName="w-full"
                  className="w-full bg-transparent h-10 focus:outline-none"
                />
              </div>

              {errors.dob && <p className="text-red-500">{errors.dob}</p>}
            </div>

            <div className="space-y-2">
              <label className="block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "bg-red-500/5 border border-red-500/50 text-red-500":
                      errors.email,
                  }
                )}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="block">Phone</label>
              <input
                type="number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "bg-red-500/5 border border-red-500/50 text-red-500":
                      errors.mobile,
                  }
                )}
              />
              {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-indigo-500 text-white p-2 rounded"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Service Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block">Cities/Regions of Service</label>

              <Select
                id="cities"
                options={citiesOptions}
                isMulti
                value={selectedCities}
                onChange={handleSelectedCitiesChange}
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
              <label className="block">Exact Location</label>
              <SetLocation
                className={cn({
                  "bg-red-500/5 border border-red-500/50 text-red-500":
                    errors.location,
                })}
                location={formData.location}
                setLocation={handleLocationChange}
                required
              />
              {errors.location && (
                <p className="text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block">Service Categories</label>

              <Select
                id="categories"
                options={serviceCategoriesOptions}
                isMulti
                value={selectedServiceCategories}
                onChange={handleSelectedCategoriesChange}
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
              />
              {errors.categories && (
                <p className="text-red-500">{errors.categories}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block">Years of Experience</label>
              <input
                type="number"
                name="years_experience"
                min="0"
                max="80"
                value={formData.years_experience}
                onChange={handleChange}
                required
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "bg-red-500/5 border border-red-500/50 text-red-500":
                      errors.years_experience,
                  }
                )}
              />
              {errors.years_experience && (
                <p className="text-red-500">{errors.years_experience}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block">Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className={cn(
                  "w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  {
                    "bg-red-500/5 border border-red-500/50 text-red-500":
                      errors.skills,
                  }
                )}
              />
              {errors.skills && <p className="text-red-500">{errors.skills}</p>}
            </div>

            <div className="w-full flex gap-2 pt-3">
              <button
                type="button"
                onClick={prevStep}
                className="bg-indigo-500 text-white p-2 rounded w-1/2"
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded w-1/2"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default IndividualProviderInquiryForm;
