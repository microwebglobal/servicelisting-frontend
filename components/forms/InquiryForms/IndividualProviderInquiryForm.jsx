"use client";
import React, { useEffect, useState } from "react";
import { serviceAPI } from "@/api/services";
import Select from "react-select";
import { providerAPI } from "@api/provider";
import { useToast } from "@/hooks/use-toast";
import SetLocation from "@components/SetLocation";

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
  const { toast } = useToast();
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

  // Go to Next Step
  const nextStep = () => setStep((prev) => prev + 1);

  // Go to Previous Step
  const prevStep = () => setStep((prev) => prev - 1);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = {
      ...formData,
      cities: selectedCities.map((city) => city.value),
      categories: selectedServiceCategories.map((cat) => cat.value),
      years_experience: 4,
      location: {
        type: "Point",
        coordinates: [79.8612, 6.9271],
      },
    };

    try {
      await providerAPI.createEnquiry(formDataToSend);
      console.log("Final Form Data:", formDataToSend);
      alert("Form submitted successfully!");
      toast({
        title: "Success",
        description: "Inquiry Form Sucessfully Submitted",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed To Submit Inquiry Form",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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

            <label className="block mb-2">Date Of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block mb-2">Phone</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

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
                required
              />
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
                required
              />
            </div>

            <label className="block mb-2">Years Experiance</label>
            <input
              type="number"
              name="years_experience"
              value={formData.years_experience}
              onChange={handleChange}
              required
              className="w-full border p-2 mb-4"
            />

            <label className="block mb-2">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              className="w-full border p-2 mb-4"
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
