import React, { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { providerAPI } from "@/api/provider";
import Select from "react-select";
import { toast } from "@hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import FileInput from "@/components/FileInput";

const spokenLanguages = [
  { label: "Hindi", value: "hindi" },
  { label: "Tamil", value: "tamil" },
];

const IndividualRegistrationForm = ({
  enquiryData,
  previousRegData,
  rejectedFields,
}) => {
  const isReRegistration = previousRegData && rejectedFields?.length > 0;

  const [formData, setFormData] = useState({
    enquiry_id: enquiryData?.enquiry_id || "",
    name: enquiryData?.User?.name || "",
    dob: enquiryData?.User?.dob || "",
    nationality: previousRegData?.nationality || "",
    gender: enquiryData?.User?.gender || "",
    qualification: enquiryData?.qualification || "",
    email: enquiryData?.User?.email || "",
    phone: enquiryData?.User?.mobile || "",
    whatsapp_number: previousRegData?.whatsapp_number || "",
    alternate_number:
      previousRegData?.alternate_number || enquiryData?.alternate_number || "",
    exact_address: previousRegData?.exact_address || "",
    emergency_contact_name: previousRegData?.emergency_contact_name || "",
    reference_number: previousRegData?.reference_number || "",
    reference_name: previousRegData?.reference_name || "",
    aadhar_number: previousRegData?.aadhar_number || "",
    pan_number: previousRegData?.pan_number || "",
    languages_spoken: previousRegData?.languages_spoken
      ? JSON.parse(previousRegData?.languages_spoken)
      : [],
    service_radius: previousRegData?.service_radius || "",
    availability_type: previousRegData?.availability_type || "full_time",
    availability_hours: previousRegData?.availability_hours || {
      monday: { start: "09:00", end: "18:00", isOpen: true },
      tuesday: { start: "09:00", end: "18:00", isOpen: true },
      wednesday: { start: "09:00", end: "18:00", isOpen: true },
      thursday: { start: "09:00", end: "18:00", isOpen: true },
      friday: { start: "09:00", end: "18:00", isOpen: true },
      saturday: { start: "09:00", end: "18:00", isOpen: true },
      sunday: { start: "09:00", end: "18:00", isOpen: false },
    },
    years_experience: enquiryData?.years_experience || "",
    specializations: enquiryData?.skills || [],

    profile_bio: previousRegData?.profile_bio || "",
    certificates_awards: previousRegData?.qualification || "",

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
    payment_method: previousRegData?.payment_method || "upi",
    payment_details: {
      upi: {
        id: previousRegData?.payment_details?.upi?.id || "",
        display_name: previousRegData?.payment_details?.upi?.display_name || "",
        phone: previousRegData?.payment_details?.upi?.phone || "",
      },
      bank: {
        name: previousRegData?.payment_details?.bank?.name || "",
        branch: previousRegData?.payment_details?.bank?.branch || "",
        ifsc: previousRegData?.payment_details?.bank?.ifsc || "",
        account_number:
          previousRegData?.payment_details?.bank?.account_number || "",
      },
    },
    categories: (enquiryData?.ServiceCategories || []).map((cat) => ({
      id: cat.category_id || "",
      experience_years: 0,
      is_primary: false,
    })),
    cities: (enquiryData?.Cities || []).map((city) => ({
      id: city.city_id || "",
      service_radius: 0,
      is_primary: false,
    })),
    primary_location: enquiryData?.primary_location || "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState(
    previousRegData.languages_spoken?.length
      ? spokenLanguages.filter((lang) =>
          JSON.parse(previousRegData.languages_spoken).includes(lang.value)
        )
      : []
  );

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, files, required } = e.target;

    // Custom error keys for part-time availability hours
    const erroKey =
      name === "availability_hours.start"
        ? "start_time"
        : name === "availability_hours.end"
        ? "end_time"
        : name;

    // Show/hide error messages realtime
    if (value === "" && required) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [erroKey]: `${name.split("_").join(" ")} is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [erroKey]: "",
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

  const isValidTimeSlot = (availability_hours) => {
    const { start, end } = availability_hours;
    if (start > end) return "Start time cannot be after end time";
  };

  const validateStep = (stepNumber) => {
    let newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.nationality) newErrors.nationality = "Required";
        else if (!formData.nationality.match(/^[a-zA-Z\s]+$/))
          newErrors.nationality = "Only alphabets are allowed";
        if (!formData.aadhar_number) newErrors.aadhar_number = "Required";
        if (!formData.aadhar_number.match(/^\d{12}$/))
          newErrors.aadhar_number = "Invalid Aadhar Number";
        if (!formData.pan_number) newErrors.pan_number = "Required";
        if (!formData.pan_number.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/))
          newErrors.pan_number = "Invalid PAN Number";
        if (!formData.exact_address) newErrors.exact_address = "Required";
        if (
          !formData.languages_spoken ||
          formData.languages_spoken.length === 0
        )
          newErrors.languages_spoken = "Required";
        break;
      case 2:
        if (!formData.service_radius) newErrors.service_radius = "Required";
        if (!formData.profile_bio) newErrors.profile_bio = "Required";
        if (formData.availability_type === "part_time") {
          if (!formData.availability_hours.start)
            newErrors.start_time = "Required";
          if (!formData.availability_hours.end) newErrors.end_time = "Required";

          const error = isValidTimeSlot(formData.availability_hours);
          if (error) newErrors.availability_hours = error;
        }
        break;
      case 3:
        if (isReRegistration) {
          if (!formData.documents.logo && rejectedFields.includes("logo"))
            newErrors.logo = "Required";
          if (
            !formData.documents.id_proof &&
            rejectedFields.includes("id_proof")
          )
            newErrors.id_proof = "Required";
          if (!formData.documents.aadhar && rejectedFields.includes("aadhar"))
            newErrors.aadhar = "Required";
          if (!formData.documents.pan && rejectedFields.includes("pan"))
            newErrors.pan = "Required";
          if (
            !formData.documents.address_proof &&
            rejectedFields.includes("address_proof")
          )
            newErrors.address_proof = "Required";
          if (
            !formData.documents.agreement &&
            rejectedFields.includes("agreement")
          )
            newErrors.agreement = "Required";
          if (
            !formData.documents.terms_acceptance &&
            rejectedFields.includes("terms_acceptance")
          )
            newErrors.terms_acceptance = "Required";
        } else {
          if (!formData.documents.logo) newErrors.logo = "Required";
          if (!formData.documents.id_proof) newErrors.id_proof = "Required";
          if (!formData.documents.aadhar) newErrors.aadhar = "Required";
          if (!formData.documents.pan) newErrors.pan = "Required";
          if (!formData.documents.address_proof)
            newErrors.address_proof = "Required";
          if (!formData.documents.agreement) newErrors.agreement = "Required";
          if (!formData.documents.terms_acceptance)
            newErrors.terms_acceptance = "Required";
        }
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
    disabled = false,
    required = false
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
        disabled={
          (isReRegistration && !rejectedFields.includes(name)) || disabled
        }
        required={required}
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
        [name]: null,
      },
    }));
  };

  const renderFileInput = (name, label, required = false) => {
    return (
      <div className="space-y-2 w-full">
        <FileInput
          name={name}
          label={label}
          required={required}
          file={formData.documents[name]}
          onFileChange={handleChange}
          disabled={isReRegistration && !rejectedFields.includes(name)}
          onFileRemove={() => handleRemoveFile(name)}
        />

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
        {renderInputField("nationality", "Nationality*", "text", false, true)}
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
            isDisabled={
              isReRegistration && !rejectedFields.includes("languages")
            }
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
            placeholder="Languages Spoken*"
            required
          />
          {errors.languages_spoken && (
            <p className="text-red-500 text-sm mt-1">
              {errors.languages_spoken}
            </p>
          )}
        </div>

        {renderInputField(
          "aadhar_number",
          "Aadhar Number*",
          "number",
          false,
          true
        )}
        {renderInputField("pan_number", "PAN Number*", "text", false, true)}
        {renderInputField("email", "Email", "email", true)}
        {renderInputField("phone", "Phone Number", "number", true)}
        {renderInputField("whatsapp_number", "WhatsApp Number", "number")}
        {renderInputField("alternate_number", "Alternate Number", "number")}
      </div>

      <div className="space-y-2">
        <textarea
          name="exact_address"
          value={formData.exact_address}
          onChange={handleChange}
          placeholder="Address*"
          disabled={isReRegistration && !rejectedFields.includes("address")}
          className={`w-full p-2 border rounded ${
            errors.exact_address ? "border-red-500 bg-red-500/5" : ""
          }`}
          rows="3"
        />

        {errors.exact_address && (
          <p className="text-red-500 text-sm mt-1">{errors.exact_address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderInputField(
          "emergency_contact_name",
          "Emergency Contact Name",
          "text"
        )}
        {renderInputField("reference_name", "Reference Name", "text")}
        {renderInputField("reference_number", "Reference Number", "number")}
      </div>
    </div>
  );

  const renderServiceDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Service Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderInputField(
          "service_radius",
          "Service Radius (km)*",
          "number",
          false,
          true
        )}
        <select
          name="availability_type"
          value={formData.availability_type}
          onChange={handleChange}
          className="p-2 border rounded w-full h-11"
          disabled={
            isReRegistration && !rejectedFields.includes("availability_hours")
          }
        >
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
        </select>
      </div>
      {formData.availability_type === "part_time" && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                type="time"
                name="availability_hours.start"
                value={formData.availability_hours.start || ""}
                disabled={
                  isReRegistration &&
                  !rejectedFields.includes("availability_hours")
                }
                onChange={handleChange}
                className={cn("p-2 border rounded w-full", {
                  "border-red-500 bg-red-500/5 text-red-500": errors.start_time,
                })}
              />
              {errors.start_time && (
                <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="time"
                name="availability_hours.end"
                value={formData.availability_hours.end || ""}
                disabled={
                  isReRegistration &&
                  !rejectedFields.includes("availability_hours")
                }
                onChange={handleChange}
                className={cn("p-2 border rounded w-full", {
                  "border-red-500 bg-red-500/5 text-red-500": errors.end_time,
                })}
              />
              {errors.end_time && (
                <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
              )}
            </div>
          </div>

          {errors.availability_hours && (
            <p className="text-red-500 text-sm mt-1">
              {errors.availability_hours}
            </p>
          )}
        </div>
      )}
      <textarea
        name="specializations"
        value={formData.specializations}
        onChange={handleChange}
        disabled={
          isReRegistration && !rejectedFields.includes("specializations")
        }
        placeholder="Specializations/Skills"
        className="w-full p-2 border rounded"
        rows="3"
        required
      />

      <div className="space-y-2">
        <textarea
          name="profile_bio"
          value={formData.profile_bio}
          onChange={handleChange}
          placeholder="Profile Bio*"
          disabled={isReRegistration && !rejectedFields.includes("profile_bio")}
          className={`w-full p-2 border rounded ${
            errors.profile_bio ? "border-red-500 bg-red-500/5" : ""
          }`}
          rows="3"
          required
        />

        {errors.profile_bio && (
          <p className="text-red-500 text-sm mt-1">{errors.profile_bio}</p>
        )}
      </div>

      <textarea
        name="certificates_awards"
        value={formData.certificates_awards}
        onChange={handleChange}
        placeholder="Certificates/Awards"
        className="w-full p-2 border rounded"
        disabled={
          isReRegistration && !rejectedFields.includes("qualifications")
        }
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
        disabled={
          isReRegistration && !rejectedFields.includes("payment_details")
        }
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
            disabled={
              isReRegistration && !rejectedFields.includes("payment_details")
            }
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
            disabled={
              isReRegistration && !rejectedFields.includes("payment_details")
            }
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
            disabled={
              isReRegistration && !rejectedFields.includes("payment_details")
            }
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
            disabled={
              isReRegistration && !rejectedFields.includes("payment_details")
            }
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
            disabled={
              isReRegistration && !rejectedFields.includes("payment_details")
            }
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
            disabled={
              isReRegistration && !rejectedFields.includes("payment_details")
            }
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
            disabled={
              isReRegistration && !rejectedFields.includes("payment_details")
            }
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
