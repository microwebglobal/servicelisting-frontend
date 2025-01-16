import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { providerAPI } from "@/api/provider";
import Select from "react-select";
import { toast } from "@hooks/use-toast";

const IndividualRegistrationForm = ({ previousData }) => {
  const [formData, setFormData] = useState({
    enquiry_id: previousData?.enquiry_id || "",
    name: previousData?.User?.name || "",
    dob: previousData?.User?.dob || "",
    nationality: "",
    gender: previousData?.User?.gender || "",
    qualification: "",
    email: previousData?.User?.email || "",
    phone: previousData?.User?.mobile || "",
    whatsapp_number: "",
    alternate_number: previousData?.alternate_number || "",
    address: "",
    emergency_contact_name: "",
    reference_number: "",
    reference_name: "",
    aadhar_number: "",
    pan_number: "",
    languages_spoken: [],
    service_radius: "",
    availability_type: "full_time",
    availability_hours: {
      start: "08:00",
      end: "22:00",
    },
    years_experience: previousData?.years_experience || "",
    specializations: previousData?.skills || [],
    profile_bio: "",
    certificates_awards: "",
    profile_picture: null,
    id_proof: null,
    aadhar_card: null,
    pan_card: null,
    address_proof: null,
    qualification_proof: null,
    service_certificates: null,
    insurance_documents: null,
    signed_agreement: null,
    signed_terms: null,
    portfolio_images: [],
    social_media_links: {
      facebook: "",
      instagram: "",
      linkedin: "",
    },
    payment_method: "upi",
    payment_details: {
      upi: {
        id: "",
        display_name: "",
        phone: "",
      },
      bank: {
        name: "",
        branch: "",
        ifsc: "",
        account_number: "",
      },
    },
    categories: (previousData?.ServiceCategories || []).map((cat) => ({
      id: cat.category_id || "",
      experience_years: 0,
      is_primary: false,
    })),
    cities: (previousData?.Cities || []).map((city) => ({
      id: city.city_id || "",
      service_radius: 0,
      is_primary: false,
    })),
    primary_location: previousData?.primary_location || "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const spokenLanguages = [
    { label: "Hindi", value: "hindi" },
    { label: "Tamil", value: "tamil" },
  ];

  useEffect(() => {
    if (previousData?.enquiry_id) {
      setFormData((prev) => ({
        ...prev,
        enquiry_id: previousData.enquiry_id,
      }));
    }
  }, [previousData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (name === "portfolio_images" || name === "service_certificates") {
        setFormData((prev) => ({
          ...prev,
          [name]: Array.from(files),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
      return;
    }

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      if (grandchild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.nationality) newErrors.nationality = "Required";
        if (!formData.aadhar_number) newErrors.aadhar_number = "Required";
        if (!formData.pan_number) newErrors.pan_number = "Required";
        if (!formData.address) newErrors.address = "Required";
        break;
      case 2:
        if (!formData.service_radius) newErrors.service_radius = "Required";
        if (!formData.profile_bio) newErrors.profile_bio = "Required";
        break;
      case 3:
        if (!formData.profile_picture) newErrors.profile_picture = "Required";
        if (!formData.id_proof) newErrors.id_proof = "Required";
        if (!formData.aadhar_card) newErrors.aadhar_card = "Required";
        if (!formData.pan_card) newErrors.pan_card = "Required";
        if (!formData.address_proof) newErrors.address_proof = "Required";
        if (!formData.signed_agreement) newErrors.signed_agreement = "Required";
        if (!formData.signed_terms) newErrors.signed_terms = "Required";
        break;
      case 4:
        if (formData.payment_method === "upi") {
          if (!formData.payment_details.upi.id)
            newErrors["payment_details.upi.id"] = "Required";
          if (!formData.payment_details.upi.display_name)
            newErrors["payment_details.upi.display_name"] = "Required";
          if (!formData.payment_details.upi.phone)
            newErrors["payment_details.upi.phone"] = "Required";
        } else {
          if (!formData.payment_details.bank.name)
            newErrors["payment_details.bank.name"] = "Required";
          if (!formData.payment_details.bank.branch)
            newErrors["payment_details.bank.branch"] = "Required";
          if (!formData.payment_details.bank.ifsc)
            newErrors["payment_details.bank.ifsc"] = "Required";
          if (!formData.payment_details.bank.account_number)
            newErrors["payment_details.bank.account_number"] = "Required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    setLoading(true);
    setFormData((prev) => ({
      ...prev,
      languages_spoken: selectedLanguages.map((lan) => lan.value),
    }));

    try {
      const formDataObj = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          ![
            "portfolio_images",
            "profile_picture",
            "id_proof",
            "aadhar_card",
            "pan_card",
            "address_proof",
            "qualification_proof",
            "service_certificates",
            "insurance_documents",
            "signed_agreement",
            "signed_terms",
          ].includes(key)
        ) {
          formDataObj.append(
            key,
            typeof formData[key] === "object"
              ? JSON.stringify(formData[key])
              : formData[key]
          );
        }
      });

      const singleFiles = [
        "profile_picture",
        "id_proof",
        "aadhar_card",
        "pan_card",
        "address_proof",
        "qualification_proof",
        "insurance_documents",
        "signed_agreement",
        "signed_terms",
      ];

      singleFiles.forEach((file) => {
        if (formData[file]) formDataObj.append(file, formData[file]);
      });

      if (formData.portfolio_images?.length) {
        Array.from(formData.portfolio_images).forEach((image) => {
          formDataObj.append("portfolio_images", image);
        });
      }

      if (formData.service_certificates?.length) {
        Array.from(formData.service_certificates).forEach((cert) => {
          formDataObj.append("service_certificates", cert);
        });
      }

      const response = await providerAPI.registerProvider(formDataObj);
      toast({
        title: "Success!",
        description: "Your registration was submitted successfully.",
        variant: "default",
      });

      const providerId = response?.provider_id || response?.data?.provider_id;

      if (providerId) {
        toast({
          title: "Success!",
          description: "Your registration was submitted successfully.",
          variant: "default",
        });
      } else if (response?.message === "Provider registered successfully") {
        toast({
          title: "Success!",
          description: "Your registration was submitted successfully.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response?.message,
          variant: "destructive",
        });
        throw new Error("Registration failed: Invalid response format");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    name,
    placeholder,
    type = "text",
    disabled = false
  ) => (
    <input
      type={type}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      placeholder={placeholder}
      className={`p-2 border rounded w-full ${
        errors[name] ? "border-red-500" : ""
      }`}
      disabled={disabled}
    />
  );

  const renderFileInput = (name, label, required = false) => (
    <div className="space-y-2">
      <label className="block">
        {label}
        {required && "*"}
      </label>
      <input
        type="file"
        name={name}
        onChange={handleChange}
        className={`w-full ${errors[name] ? "border-red-500" : ""}`}
        multiple={
          name === "portfolio_images" || name === "service_certificates"
        }
      />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <div className="grid grid-cols-2 gap-4">
        {renderInputField("name", "Full Name", "text", true)}
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          disabled
        />
        {renderInputField("nationality", "Nationality")}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          disabled
        >
          <option value="">{formData.gender}</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <Select
          id="categories"
          options={spokenLanguages}
          isMulti
          value={selectedLanguages}
          onChange={(selectedOptions) => {
            setSelectedLanguages(selectedOptions);
            setFormData((prev) => ({
              ...prev,
              languages_spoken: selectedOptions.map((lan) => lan.value),
            }));
          }}
          required
        />

        {renderInputField("aadhar_number", "Aadhar Number")}
        {renderInputField("pan_number", "PAN Number")}
        {renderInputField("email", "Email", "email", true)}
        {renderInputField("phone", "Phone Number", "tel", true)}
        {renderInputField("whatsapp_number", "WhatsApp Number", "tel")}
        {renderInputField("alternate_number", "Alternate Number", "tel")}
      </div>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className={`w-full p-2 border rounded ${
          errors.address ? "border-red-500" : ""
        }`}
        rows="3"
      />
      <div className="grid grid-cols-2 gap-4">
        {renderInputField("emergency_contact_name", "Emergency Contact Name")}
        {renderInputField("reference_name", "Reference Name")}
        {renderInputField("reference_number", "Reference Number")}
      </div>
    </div>
  );

  const renderServiceDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Service Details</h2>
      <div className="grid grid-cols-2 gap-4">
        {renderInputField("service_radius", "Service Radius (km)", "number")}
        <select
          name="availability_type"
          value={formData.availability_type}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
        </select>
      </div>
      {formData.availability_type === "part_time" && (
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            name="availability_hours.start"
            value={formData.availability_hours.start}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="time"
            name="availability_hours.end"
            value={formData.availability_hours.end}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>
      )}
      <textarea
        name="specializations"
        value={formData.specializations}
        onChange={handleChange}
        placeholder="Specializations/Skills"
        className="w-full p-2 border rounded"
        rows="3"
      />
      <textarea
        name="profile_bio"
        value={formData.profile_bio}
        onChange={handleChange}
        placeholder="Profile Bio"
        className={`w-full p-2 border rounded ${
          errors.profile_bio ? "border-red-500" : ""
        }`}
        rows="3"
      />
      <textarea
        name="certificates_awards"
        value={formData.certificates_awards}
        onChange={handleChange}
        placeholder="Certificates/Awards"
        className="w-full p-2 border rounded"
        rows="3"
      />
    </div>
  );

  const renderDocumentUploads = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Document Uploads</h2>
      <div className="grid grid-cols-2 gap-4">
        {renderFileInput("profile_picture", "Profile Picture", true)}
        {renderFileInput("id_proof", "ID Proof", true)}
        {renderFileInput("aadhar_card", "Aadhar Card", true)}
        {renderFileInput("pan_card", "PAN Card", true)}
        {renderFileInput("address_proof", "Address Proof", true)}
        {renderFileInput("qualification_proof", "Qualification Proof")}
        {renderFileInput("service_certificates", "Service Certificates")}
        {renderFileInput("insurance_documents", "Insurance Documents")}
        {renderFileInput("portfolio_images", "Portfolio Images")}
      </div>
      {renderFileInput("signed_agreement", "Signed Agreement", true)}
      {renderFileInput("signed_terms", "Signed Terms & Conditions", true)}
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Details</h2>
      <select
        name="payment_method"
        value={formData.payment_method}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="upi">UPI</option>
        <option value="bank_transfer">Bank Transfer</option>
      </select>
      {formData.payment_method === "upi" ? (
        <div className="space-y-2">
          <input
            type="text"
            name="payment_details.upi.id"
            value={formData.payment_details.upi.id}
            onChange={handleChange}
            placeholder="UPI ID"
            className={`w-full p-2 border rounded ${
              errors["payment_details.upi.id"] ? "border-red-500" : ""
            }`}
          />
          {errors["payment_details.upi.id"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.upi.id"]}
            </p>
          )}
          <input
            type="text"
            name="payment_details.upi.display_name"
            value={formData.payment_details.upi.display_name}
            onChange={handleChange}
            placeholder="Display Name"
            className={`w-full p-2 border rounded ${
              errors["payment_details.upi.display_name"] ? "border-red-500" : ""
            }`}
          />
          {errors["payment_details.upi.display_name"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.upi.display_name"]}
            </p>
          )}
          <input
            type="tel"
            name="payment_details.upi.phone"
            value={formData.payment_details.upi.phone}
            onChange={handleChange}
            placeholder="UPI Phone Number"
            className={`w-full p-2 border rounded ${
              errors["payment_details.upi.phone"] ? "border-red-500" : ""
            }`}
          />
          {errors["payment_details.upi.phone"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.upi.phone"]}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            name="payment_details.bank.name"
            value={formData.payment_details.bank.name}
            onChange={handleChange}
            placeholder="Bank Name"
            className={`w-full p-2 border rounded ${
              errors["payment_details.bank.name"] ? "border-red-500" : ""
            }`}
          />
          {errors["payment_details.bank.name"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.bank.name"]}
            </p>
          )}
          <input
            type="text"
            name="payment_details.bank.branch"
            value={formData.payment_details.bank.branch}
            onChange={handleChange}
            placeholder="Branch"
            className={`w-full p-2 border rounded ${
              errors["payment_details.bank.branch"] ? "border-red-500" : ""
            }`}
          />
          {errors["payment_details.bank.branch"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.bank.branch"]}
            </p>
          )}
          <input
            type="text"
            name="payment_details.bank.ifsc"
            value={formData.payment_details.bank.ifsc}
            onChange={handleChange}
            placeholder="IFSC Code"
            className={`w-full p-2 border rounded ${
              errors["payment_details.bank.ifsc"] ? "border-red-500" : ""
            }`}
          />
          {errors["payment_details.bank.ifsc"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.bank.ifsc"]}
            </p>
          )}
          <input
            type="text"
            name="payment_details.bank.account_number"
            value={formData.payment_details.bank.account_number}
            onChange={handleChange}
            placeholder="Account Number"
            className={`w-full p-2 border rounded ${
              errors["payment_details.bank.account_number"]
                ? "border-red-500"
                : ""
            }`}
          />
          {errors["payment_details.bank.account_number"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.bank.account_number"]}
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderPersonalDetails();
      case 2:
        return renderServiceDetails();
      case 3:
        return renderDocumentUploads();
      case 4:
        return renderPaymentDetails();
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Service Provider Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1/4 h-2 mx-1 rounded ${
                step >= i ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {renderStep()}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() =>
                  validateStep(step) && setStep((prev) => prev + 1)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
              >
                {loading ? "Submitting..." : "Complete Registration"}
              </button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IndividualRegistrationForm;
