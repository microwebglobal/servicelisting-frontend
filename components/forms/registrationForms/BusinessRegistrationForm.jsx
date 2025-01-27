import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { providerAPI } from "@/api/provider";
import { toast } from "@hooks/use-toast";

const BusinessRegistrationForm = ({ previousData }) => {
  console.log(previousData);
  const [formData, setFormData] = useState({
    // Pre-filled data from enquiry (non-editable)
    enquiry_id: previousData?.enquiry_id || "",
    business_name: previousData?.business_name || "",
    business_type: previousData?.business_type || "",
    authorized_person_name: previousData?.authorized_person_name || "",
    authorized_person_contact: previousData?.authorized_person_contact || "",
    email: previousData?.User?.email || "",
    primary_location: previousData?.primary_location || "",
    number_of_employees: previousData?.number_of_employees || "",

    // New registration fields
    business_registration_number: "",
    tax_id: "",
    business_start_date: "",
    whatsapp_number: "",
    service_radius: "",
    address: "", // Added missing address field
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
    categories: (previousData?.ServiceCategories || []).map((cat) => ({
      id: cat.category_id,
      experience_years: 0,
      is_primary: false,
    })),
    cities: [],
    employees: Array(previousData?.number_of_employees || 1).fill({
      name: "",
      gender: "",
      qualification: "",
      designation: "",
      phone: "",
      whatsapp_number: "",
      service_category: "",
      experience: "",
    }),
    documents: {
      business_registration: null,
      address_proof: null,
      insurance: null,
      terms_acceptance: null,
      agreement: null,
      logo: null,
    },
    payment_method: "upi",
    payment_details: {
      upi: { id: "", display_name: "", phone: "" },
      bank: { name: "", branch: "", ifsc: "", account_number: "" },
    },
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0],
        },
      }));
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

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...formData.employees];
    updatedEmployees[index] = {
      ...updatedEmployees[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      employees: updatedEmployees,
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.business_registration_number?.trim())
          newErrors.business_registration_number = "Required";
        if (!formData.tax_id?.trim()) newErrors.tax_id = "Required";
        if (!formData.whatsapp_number?.match(/^\d{10}$/))
          newErrors.whatsapp_number = "Required";
        break;
      case 2:
        if (!formData.service_radius?.trim())
          newErrors.service_radius = "Required";
        if (!formData.address?.trim()) newErrors.address = "Required";
        break;
      case 3:
        formData.employees.forEach((employee, index) => {
          if (!employee.name?.trim())
            newErrors[`employees.${index}.name`] = "Required";
          if (!employee.phone?.match(/^\d{10}$/))
            newErrors[`employees.${index}.phone`] = "Required";
        });
        break;
      case 4:
        if (!formData.documents.business_registration)
          newErrors.business_registration_doc = "Required";
        if (!formData.documents.address_proof)
          newErrors.address_proof = "Required";
        if (!formData.documents.terms_acceptance)
          newErrors.signed_terms = "Required";
        if (!formData.documents.agreement)
          newErrors.signed_agreement = "Required";
        break;
      case 5:
        if (formData.payment_method === "upi") {
          if (!formData.payment_details.upi.id?.trim())
            newErrors["payment_details.upi.id"] = "Required";
          if (!formData.payment_details.upi.display_name?.trim())
            newErrors["payment_details.upi.display_name"] = "Required";
          if (!formData.payment_details.upi.phone?.trim())
            newErrors["payment_details.upi.phone"] = "Required";
        } else {
          if (!formData.payment_details.bank.name?.trim())
            newErrors["payment_details.bank.name"] = "Required";
          if (!formData.payment_details.bank.branch?.trim())
            newErrors["payment_details.bank.branch"] = "Required";
          if (!formData.payment_details.bank.ifsc?.trim())
            newErrors["payment_details.bank.ifsc"] = "Required";
          if (!formData.payment_details.bank.account_number?.trim())
            newErrors["payment_details.bank.account_number"] = "Required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);

    if (!validateStep(step)) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append non-file fields
      Object.keys(formData).forEach((key) => {
        if (
          key !== "documents" &&
          formData[key] !== undefined &&
          formData[key] !== null
        ) {
          formDataToSend.append(
            key,
            typeof formData[key] === "object"
              ? JSON.stringify(formData[key])
              : formData[key]
          );
        }
      });

      // Append file fields
      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });

      console.log("FormData to send:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await providerAPI.registerProvider(formDataToSend);

      toast({
        title: "Success!",
        description: "Your registration was submitted successfully.",
        variant: "default",
      });

      console.log(response);

      if (response?.provider_id) {
        // Handle success
        toast({
          title: "Success!",
          description: "Your registration was submitted successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      setErrors(error.response?.data?.validation || {});

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

  const renderReadOnlyField = (label, value) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        disabled
        className="mt-1 p-2 w-full bg-gray-100 border rounded-md"
      />
    </div>
  );

  const renderBusinessInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Business Information</h2>

      {renderReadOnlyField("Business Name", formData.business_name)}
      {renderReadOnlyField(
        "Authorized Person",
        formData.authorized_person_name
      )}
      {renderReadOnlyField(
        "Contact Number",
        formData.authorized_person_contact
      )}
      {renderReadOnlyField("Email", formData.email)}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            placeholder="Tax Identification Number*"
            className={`p-2 border rounded w-full ${
              errors.tax_id ? "border-red-500" : ""
            }`}
          />
          {errors.tax_id && (
            <p className="text-red-500 text-sm mt-1">{errors.tax_id}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="business_registration_number"
            value={formData.business_registration_number}
            onChange={handleChange}
            placeholder="Business Registration Number*"
            className={`p-2 border rounded w-full ${
              errors.business_registration_number ? "border-red-500" : ""
            }`}
          />
          {errors.business_registration_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.business_registration_number}
            </p>
          )}
        </div>
        <div>
          <input
            type="tel"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleChange}
            placeholder="WhatsApp Number*"
            className={`p-2 border rounded w-full ${
              errors.whatsapp_number ? "border-red-500" : ""
            }`}
          />
          {errors.whatsapp_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.whatsapp_number}
            </p>
          )}
        </div>
        <div>
          <input
            type="date"
            name="business_start_date"
            value={formData.business_start_date}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            placeholder="Business Start Date"
          />
        </div>
      </div>
    </div>
  );

  const renderServiceDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Service Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="number"
            name="service_radius"
            value={formData.service_radius}
            onChange={handleChange}
            placeholder="Service Radius (km)*"
            className={`p-2 border rounded w-full ${
              errors.service_radius ? "border-red-500" : ""
            }`}
          />
          {errors.service_radius && (
            <p className="text-red-500 text-sm mt-1">{errors.service_radius}</p>
          )}
        </div>
      </div>
      <div>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Business Address*"
          className={`w-full p-2 border rounded ${
            errors.address ? "border-red-500" : ""
          }`}
          rows="3"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>
    </div>
  );

  const renderEmployeeDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Employee Details</h2>
      {formData.employees.map((employee, index) => (
        <div key={index} className="p-4 border rounded space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Employee {index + 1}</h3>
            {/* {index > 0 && (
              <button
                type="button"
                onClick={() => removeEmployee(index)}
                className="text-red-500"
              >
                Remove
              </button>
            )} */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={employee.name}
                onChange={(e) =>
                  handleEmployeeChange(index, "name", e.target.value)
                }
                placeholder="Employee Name*"
                className={`p-2 border rounded w-full ${
                  errors[`employees.${index}.name`] ? "border-red-500" : ""
                }`}
              />
              {errors[`employees.${index}.name`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`employees.${index}.name`]}
                </p>
              )}
            </div>
            <select
              value={employee.gender}
              onChange={(e) =>
                handleEmployeeChange(index, "gender", e.target.value)
              }
              className="p-2 border rounded w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              value={employee.qualification}
              onChange={(e) =>
                handleEmployeeChange(index, "qualification", e.target.value)
              }
              placeholder="Qualification"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              value={employee.designation}
              onChange={(e) =>
                handleEmployeeChange(index, "designation", e.target.value)
              }
              placeholder="Designation"
              className="p-2 border rounded w-full"
            />
            <div>
              <input
                type="tel"
                value={employee.phone}
                onChange={(e) =>
                  handleEmployeeChange(index, "phone", e.target.value)
                }
                placeholder="Phone Number*"
                className={`p-2 border rounded w-full ${
                  errors[`employees.${index}.phone`] ? "border-red-500" : ""
                }`}
              />
              {errors[`employees.${index}.phone`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`employees.${index}.phone`]}
                </p>
              )}
            </div>
            <input
              type="tel"
              value={employee.whatsapp_number}
              onChange={(e) =>
                handleEmployeeChange(index, "whatsapp_number", e.target.value)
              }
              placeholder="WhatsApp Number"
              className="p-2 border rounded w-full"
            />
          </div>
        </div>
      ))}
      {/* <button
        type="button"
        onClick={addEmployee}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Employee
      </button> */}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Documents</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Business Registration Document*</label>
          <input
            type="file"
            name="business_registration"
            onChange={handleChange}
            className={`w-full ${
              errors.business_registration_doc ? "border-red-500" : ""
            }`}
          />
          {errors.business_registration_doc && (
            <p className="text-red-500 text-sm mt-1">
              {errors.business_registration_doc}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-2">Address Proof*</label>
          <input
            type="file"
            name="address_proof"
            onChange={handleChange}
            className={`w-full ${errors.address_proof ? "border-red-500" : ""}`}
          />
          {errors.address_proof && (
            <p className="text-red-500 text-sm mt-1">{errors.address_proof}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">Employee Insurance Documents</label>
          <input
            type="file"
            name="insurance"
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Signed Terms & Conditions*</label>
          <input
            type="file"
            name="terms_acceptance"
            onChange={handleChange}
            className={`w-full ${errors.signed_terms ? "border-red-500" : ""}`}
          />
          {errors.signed_terms && (
            <p className="text-red-500 text-sm mt-1">{errors.signed_terms}</p>
          )}
        </div>
        <div>
          <label className="block mb-2">Signed Service Agreement*</label>
          <input
            type="file"
            name="agreement"
            onChange={handleChange}
            className={`w-full ${
              errors.signed_agreement ? "border-red-500" : ""
            }`}
          />
          {errors.signed_agreement && (
            <p className="text-red-500 text-sm mt-1">
              {errors.signed_agreement}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-2">Business Logo</label>
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            className="w-full"
            accept="image/*"
          />
        </div>
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
        <option value="bank_transfer">Bank Transfer</option>
      </select>

      {formData.payment_method === "upi" ? (
        <div className="space-y-2">
          <div>
            <input
              type="text"
              name="payment_details.upi.id"
              value={formData.payment_details.upi.id}
              onChange={handleChange}
              placeholder="UPI ID*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.upi.id"] ? "border-red-500" : ""
              }`}
            />
            {errors["payment_details.upi.id"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["payment_details.upi.id"]}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="payment_details.upi.display_name"
              value={formData.payment_details.upi.display_name}
              onChange={handleChange}
              placeholder="Display Name*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.upi.display_name"]
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors["payment_details.upi.display_name"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["payment_details.upi.display_name"]}
              </p>
            )}
          </div>
          <div>
            <input
              type="tel"
              name="payment_details.upi.phone"
              value={formData.payment_details.upi.phone}
              onChange={handleChange}
              placeholder="UPI Phone Number*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.upi.phone"] ? "border-red-500" : ""
              }`}
            />
            {errors["payment_details.upi.phone"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["payment_details.upi.phone"]}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <input
              type="text"
              name="payment_details.bank.name"
              value={formData.payment_details.bank.name}
              onChange={handleChange}
              placeholder="Bank Name*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.name"] ? "border-red-500" : ""
              }`}
            />
            {errors["payment_details.bank.name"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["payment_details.bank.name"]}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="payment_details.bank.branch"
              value={formData.payment_details.bank.branch}
              onChange={handleChange}
              placeholder="Branch*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.branch"] ? "border-red-500" : ""
              }`}
            />
            {errors["payment_details.bank.branch"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["payment_details.bank.branch"]}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="payment_details.bank.ifsc"
              value={formData.payment_details.bank.ifsc}
              onChange={handleChange}
              placeholder="IFSC Code*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.ifsc"] ? "border-red-500" : ""
              }`}
            />
            {errors["payment_details.bank.ifsc"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["payment_details.bank.ifsc"]}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="payment_details.bank.account_number"
              value={formData.payment_details.bank.account_number}
              onChange={handleChange}
              placeholder="Account Number*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.account_number"]
                  ? "border-red-500"
                  : ""
              }`}
            />
            {errors["payment_details.bank.account_number"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["payment_details.bank.account_number"]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderBusinessInfo();
      case 2:
        return renderServiceDetails();
      case 3:
        return renderEmployeeDetails();
      case 4:
        return renderDocuments();
      case 5:
        return renderPaymentDetails();
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Business Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-1/5 h-2 mx-1 rounded ${
                step >= i ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {renderStep()}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Previous
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 ml-auto"
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

export default BusinessRegistrationForm;
