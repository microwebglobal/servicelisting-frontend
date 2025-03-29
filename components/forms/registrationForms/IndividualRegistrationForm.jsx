import React, { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { providerAPI } from "@/api/provider";
import Select from "react-select";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";

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
      monday: { start: "09:00", end: "18:00", isOpen: true },
      tuesday: { start: "09:00", end: "18:00", isOpen: true },
      wednesday: { start: "09:00", end: "18:00", isOpen: true },
      thursday: { start: "09:00", end: "18:00", isOpen: true },
      friday: { start: "09:00", end: "18:00", isOpen: true },
      saturday: { start: "09:00", end: "18:00", isOpen: true },
      sunday: { start: "09:00", end: "18:00", isOpen: false },
    },
    years_experience: previousData?.years_experience || "",
    specializations: previousData?.skills || [],

    profile_bio: "",
    certificates_awards: "",

    documents: {
      logo: null,
      id_proof: null,
      aadhar: null,
      pan: null,
      address_proof: null,
      qualification_proof: null,
      service_certificate: null,
      insurance: null,
      agreement: null,
      terms_acceptance: null,
    },

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

  const router = useRouter();

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

    if (name === "service_radius") {
      const radius = parseInt(value);
      if (radius < 0 || radius > 1000) {
        return;
      }
    }

    if (
      name === "phone" ||
      name === "whatsapp_number" ||
      name === "alternate_number" ||
      name === "emergency_contact_number" ||
      name === "payment_details.upi.phone"
    ) {
      if (value.length > 10) {
        return;
      }
    }

    if (name === "pan_number") {
      if (value.length > 10) {
        return;
      }
    }

    if (name === "aadhar_number") {
      if (value.length > 12) {
        return;
      }
    }

    if (type === "file" && files[0]) {
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0], // Store the first selected file
        },
      }));
      return;
    }

    // Handle nested objects
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

    // Handle regular fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle language change
  const handleLanguageChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        languages_spoken: "",
      }));

      setFormData((prev) => ({
        ...prev,
        languages_spoken: selectedOptions.map((option) => option.value),
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        languages_spoken: "Select at least one language",
      }));
    }

    setSelectedLanguages(selectedOptions);
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.nationality) newErrors.nationality = "Required";
        if (!formData.aadhar_number) newErrors.aadhar_number = "Required";
        if (!formData.pan_number) newErrors.pan_number = "Required";
        if (!formData.address) newErrors.address = "Required";
        if (
          !formData.languages_spoken ||
          formData.languages_spoken.length === 0
        )
          newErrors.languages_spoken = "Required";
        break;
      case 2:
        if (!formData.service_radius) newErrors.service_radius = "Required";
        if (!formData.profile_bio) newErrors.profile_bio = "Required";
        break;
      case 3:
        if (!formData.documents.logo) newErrors.logo = "Required";
        if (!formData.documents.id_proof) newErrors.id_proof = "Required";
        if (!formData.documents.aadhar) newErrors.aadhar = "Required";
        if (!formData.documents.pan) newErrors.pan = "Required";
        if (!formData.documents.address_proof)
          newErrors.address_proof = "Required";
        if (!formData.documents.agreement) newErrors.agreement = "Required";
        if (!formData.documents.terms_acceptance)
          newErrors.terms_acceptance = "Required";
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

    try {
      const formDataObj = new FormData();

      // Append non-file fields (excluding service_certificate)
      Object.keys(formData).forEach((key) => {
        if (
          key !== "documents" &&
          formData[key] !== undefined &&
          formData[key] !== null
        ) {
          formDataObj.append(
            key,
            typeof formData[key] === "object"
              ? JSON.stringify(formData[key])
              : formData[key]
          );
        }
      });

      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file) {
          formDataObj.append(key, file);
        }
      });

      // Log FormData for debugging
      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value);
      }

      // Send the request
      const response = await providerAPI.registerProvider(formDataObj);

      if (response?.provider_id || response?.data?.provider_id) {
        toast({
          title: "Success!",
          description: "Your registration was submitted successfully.",
          variant: "default",
        });
        router.push("/service-provider/register/sucess");
      } else {
        toast({
          title: "Error",
          description: response?.message || "Registration failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.details ||
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
    <div className="space-y-2">
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`p-2 border rounded w-full ${
          errors[name] ? "border-red-500 bg-red-500/5" : ""
        }`}
        disabled={disabled}
      />

      {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
    </div>
  );

  // Function to remove a selected file
  const handleRemoveFile = (name) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: null, // Set the selected file to null to remove it
      },
    }));
  };

  const renderFileInput = (name, label, required = false) => {
    const isFileSelected = formData.documents[name] !== null;

    return (
      <div className="space-y-2 w-full">
        <label className="block">
          {label}
          {required && "*"}
        </label>

        <div className="flex items-center gap-2">
          {isFileSelected && (
            <a
              target="_blank"
              className="w-28 h-28 aspect-square"
              href={URL.createObjectURL(formData.documents[name])}
            >
              <img
                src={URL.createObjectURL(formData.documents[name])}
                alt={name}
                className="w-full h-full object-cover rounded-md"
              />
            </a>
          )}

          <div className={cn(!isFileSelected && "flex gap-1 items-center")}>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf" // Accespt PDF and image files only
              name={name} // Ensure this matches the key in the `documents` object
              onChange={handleChange}
              className={`text-transparent w-28 ${
                errors[name] ? "border-red-500 bg-red-500/5" : ""
              }`}
            />

            {isFileSelected ? (
              <p>
                <span className="block">
                  Selected File: {formData.documents[name].name}
                </span>

                <button
                  onClick={() => handleRemoveFile(name)}
                  className="text-sm text-red-500 font-medium"
                >
                  Remove
                </button>
              </p>
            ) : (
              <p>No file selected</p>
            )}
          </div>
        </div>

        {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
      </div>
    );
  };

  const renderPersonalDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          className="p-2 border rounded w-full h-11"
          disabled
        >
          <option value="">{formData.gender}</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <div className="space-y-2">
          <Select
            id="languages_spoken"
            isMulti
            options={spokenLanguages}
            value={selectedLanguages}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: errors.languages_spoken ? "red" : "",
                backgroundColor: errors.languages_spoken
                  ? "rgba(239, 68, 68, 0.05)"
                  : "",
              }),
            }}
            onChange={handleLanguageChange}
            placeholder="Languages Spoken"
            required
          />
          {errors.languages_spoken && (
            <p className="text-red-500 text-sm mt-1">
              {errors.languages_spoken}
            </p>
          )}
        </div>

        {renderInputField("aadhar_number", "Aadhar Number")}
        {renderInputField("pan_number", "PAN Number")}
        {renderInputField("email", "Email", "email", true)}
        {renderInputField("phone", "Phone Number", "number", true)}
        {renderInputField("whatsapp_number", "WhatsApp Number", "number")}
        {renderInputField("alternate_number", "Alternate Number", "number")}
      </div>

      <div className="space-y-2">
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className={`w-full p-2 border rounded ${
            errors.address ? "border-red-500 bg-red-500/5" : ""
          }`}
          rows="3"
        />

        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderInputField("emergency_contact_name", "Emergency Contact Name")}
        {renderInputField("reference_name", "Reference Name")}
        {renderInputField("reference_number", "Reference Number")}
      </div>
    </div>
  );

  const renderServiceDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Service Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderInputField("service_radius", "Service Radius (km)", "number")}
        <select
          name="availability_type"
          value={formData.availability_type}
          onChange={handleChange}
          className="p-2 border rounded w-full h-11"
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
      <div className="flex flex-col md:flex-row items-center justify-between ">
        <h2 className="text-3xl font-semibold mb-4 md:mb-0">Documents</h2>

        <a
          href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/uploads/files/1737979417230-employee_insurance_docs.pdf`}
          download
          target="_blank"
          className="inline-block px-4 py-1 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
        >
          Download Agreement
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {renderFileInput("logo", "Profile Picture", true)}
        {renderFileInput("id_proof", "ID Proof", true)}
        {renderFileInput("aadhar", "Aadhar Card", true)}
        {renderFileInput("pan", "PAN Card", true)}
        {renderFileInput("address_proof", "Address Proof", true)}
        {renderFileInput("qualification_proof", "Qualification Proof")}
        {renderFileInput("service_certificate", "Service Certificates")}
        {renderFileInput("insurance", "Insurance Documents")}
        {renderFileInput("agreement", "Signed Agreement", true)}
        {renderFileInput("terms_acceptance", "Signed Terms & Conditions", true)}
      </div>
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
        <option value="bank">Bank Transfer</option>
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
              errors["payment_details.upi.id"]
                ? "border-red-500 bg-red-500/5"
                : ""
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
              errors["payment_details.upi.display_name"]
                ? "border-red-500 bg-red-500/5"
                : ""
            }`}
          />
          {errors["payment_details.upi.display_name"] && (
            <p className="text-red-500 text-sm">
              {errors["payment_details.upi.display_name"]}
            </p>
          )}
          <input
            type="number"
            name="payment_details.upi.phone"
            value={formData.payment_details.upi.phone}
            onChange={handleChange}
            placeholder="UPI Phone Number"
            className={`w-full p-2 border rounded ${
              errors["payment_details.upi.phone"]
                ? "border-red-500 bg-red-500/5"
                : ""
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
              errors["payment_details.bank.name"]
                ? "border-red-500 bg-red-500/5"
                : ""
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
              errors["payment_details.bank.branch"]
                ? "border-red-500 bg-red-500/5"
                : ""
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
              errors["payment_details.bank.ifsc"]
                ? "border-red-500 bg-red-500/5"
                : ""
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
                ? "border-red-500 bg-red-500/5"
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
        {loading && (
          <LoadingScreen message={"Registration Application Submitting...."} />
        )}
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
            {step < 4 && (
              <button
                type="button"
                onClick={() =>
                  validateStep(step) && setStep((prev) => prev + 1)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            )}

            {step === 4 && (
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
