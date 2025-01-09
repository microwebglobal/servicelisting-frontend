"use client";
import React, { useEffect, useState } from "react";

const IndividualRegistrationForm = ({ previousData }) => {
  console.log(previousData);

  const [formData, setFormData] = useState({
    name: previousData?.User.name || "",
    email: previousData?.User.email || "",
    mobile: previousData?.User.mobile || "",
    gender: previousData?.User.gender || "",
    business_type: "individual",
    dob: previousData?.User.dob || "",
    skills: "",
    primary_location: "",
    service_radius: "",
    availability_type: "", //fulltime or part time
    availability_hours: "",
    years_experience: "",
    specializations: "",
    qualification: "",
    profile_bio: "",
    serviceCities: "",
    languages_spoken: "", //json
    social_media_links: "", //json
    social_media_links: "", //json
    photo: "",
    payment_method: "", //upi or bank
    payment_details: "", //json
    documents: "",
  });

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "languages") {
      const updatedLanguages = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: updatedLanguages });
    } else if (name.includes("upiDetails") || name.includes("bankDetails")) {
      const [section, field] = name.split(".");
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <>
          <h3 className="text-xl font-semibold">General Information</h3>
          <input
            type="text"
            name="fullName"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            readOnly={formData.name !== ""}
          />
          <input
            type="text"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            readOnly={formData.business_type !== ""}
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            readOnly={formData.dob !== ""}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            readOnly={formData.gender !== ""}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="Qualification"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            readOnly={formData.email !== ""}
          />
          <input
            type="text"
            name="phone"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Primary Phone Number (For OTP login)"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            readOnly={formData.mobile !== ""}
          />

          <select
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
          </select>
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="text-xl font-semibold">Service Details</h3>
          <input
            type="text"
            name="serviceCities"
            value={formData.serviceCities}
            onChange={handleChange}
            placeholder="Cities/Regions of Service"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="serviceLocation"
            value={formData.primary_location}
            onChange={handleChange}
            placeholder="Exact Location of Service"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="number"
            name="experience"
            value={formData.years_experience}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Specializations/Skills"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />

          <input
            type="text"
            name="certificates"
            value={formData.documents}
            onChange={handleChange}
            placeholder="Certificate/Awards"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="text-xl font-semibold">OTPVerification</h3>
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Next
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h3 className="text-xl font-semibold">Profile Details</h3>
          <textarea
            name="bio"
            value={formData.profile_bio}
            onChange={handleChange}
            placeholder="Profile Bio"
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
          <input
            type="text"
            name="socialLinks"
            value={formData.social_media_links}
            onChange={handleChange}
            placeholder="Social Media Links"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="portfolioPics"
            value={formData.photo}
            onChange={handleChange}
            placeholder="Portfolio Pictures"
            className="w-full p-2 border border-gray-300 rounded-md"
          />

          <input
            type="number"
            name="operationRadius"
            value={formData.service_radius}
            onChange={handleChange}
            placeholder="Operation Radius (in km)"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <select
            name="paymentMethod"
            value={formData.availability_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
          </select>
          <div>
            <label>Preferred Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="UPI">UPI</option>
              <option value="Bank">Bank Transfer</option>
            </select>
          </div>
          {formData.payment_method === "UPI" && (
            <>
              <h3>UPI Details</h3>
              <input
                type="text"
                name="upiDetails.upiNo"
                value={formData.upiDetails.upiNo}
                onChange={handleChange}
                placeholder="UPI No."
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="upiDetails.upiDisplayName"
                value={formData.upiDetails.upiDisplayName}
                onChange={handleChange}
                placeholder="UPI Display Name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="upiDetails.upiPhoneNo"
                value={formData.upiDetails.upiPhoneNo}
                onChange={handleChange}
                placeholder="UPI Phone No."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </>
          )}
          {formData.payment_method === "Bank" && (
            <>
              <h3>Bank Details</h3>
              <input
                type="text"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="bankDetails.branch"
                value={formData.bankDetails.branch}
                onChange={handleChange}
                placeholder="Branch"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="bankDetails.ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={handleChange}
                placeholder="IFSC Code"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="bankDetails.accountNo"
                value={formData.bankDetails.accountNo}
                onChange={handleChange}
                placeholder="Account No."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </>
          )}
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </>
      )}
    </form>
  );
};

export default IndividualRegistrationForm;
