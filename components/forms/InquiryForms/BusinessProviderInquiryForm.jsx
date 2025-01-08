"use client";
import React, { useEffect, useState } from "react";
import { serviceAPI } from "@/api/services";
import Select from "react-select";
import { providerAPI } from "@api/provider";
import SetLocation from "@components/SetLocation";

const BusinessProviderInquiryForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    business_type: "business",
    business_name: "",
    years_experience: 0,
    categories: [],
    cities: [],
    location: "",
    skills: "",
    no_of_employee: 0,
  });

  const [citiesOptions, setCitiesOpions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [serviceCategoriesOptions, setServiceCategoriesOptions] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );

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
    } catch (error) {
      console.error(error);
    }
    console.log("Final Form Data:", formDataToSend);
    alert("Form submitted successfully!");
  };
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Step 1: General Information */}
        {step === 1 && (
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

            <label className="block mb-2">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block mb-2">Authorized Person Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block mb-2">Authorized Person Contact No</label>
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
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block mb-2">No Of Employees</label>
            <input
              type="number"
              name="no_of_employee"
              value={formData.no_of_employee}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-400 text-white p-2 rounded mr-2"
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

export default BusinessProviderInquiryForm;
