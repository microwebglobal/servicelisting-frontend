import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { providerAPI } from "@/api/provider";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";
import FileInput from "@/components/FileInput";
import { CalendarSearch } from "lucide-react";
import DatePicker from "react-datepicker";

const BusinessRegistrationForm = ({
  enquiryData,
  rejectedFields,
  previousRegData,
}) => {
  const isReRegistration = previousRegData && rejectedFields?.length > 0;

  // Calculate minimum start
  const today = new Date();
  const minStartDate = today.toISOString().split("T")[0];

  // Calculate maximum start
  const maxStartDate = new Date(
    today.getFullYear() - 200,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  console.log(previousRegData);

  const [formData, setFormData] = useState({
    // Pre-filled data from enquiry (non-editable)
    enquiry_id: enquiryData?.enquiry_id || "",
    business_name: enquiryData?.business_name || "",
    business_type: enquiryData?.business_type || "",
    authorized_person_name: enquiryData?.authorized_person_name || "",
    authorized_person_contact: enquiryData?.authorized_person_contact || "",
    email: enquiryData?.User?.email || "",
    primary_location: enquiryData?.primary_location || "",
    number_of_employees: enquiryData?.number_of_employees || "",

    // New registration fields
    business_registration_number:
      previousRegData?.business_registration_number || "",
    tax_id: previousRegData?.tax_id || "",
    business_start_date: previousRegData?.business_start_date || "",
    whatsapp_number: previousRegData?.whatsapp_number || "",
    service_radius: previousRegData?.service_radius || "",
    exact_address: previousRegData?.exact_address || "", // Added missing address field
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
    categories: (enquiryData?.ServiceCategories || []).map((cat) => ({
      id: cat.category_id,
      experience_years: 0,
      is_primary: false,
    })),
    cities: (enquiryData?.Cities || []).map((city) => ({
      id: city.city_id || "",
      service_radius: 0,
      is_primary: false,
    })),
    employees:
      previousRegData?.ServiceProviderEmployees?.map((emp) => {
        return {
          name: emp.User.name,
          gender: emp.User.gender,
          qualification: emp.qualification,
          designation: emp.role,
          phone: emp.User.mobile,
          whatsapp_number: emp.whatsapp_number,
          email: emp.User.email,
          service_category: emp.service_category,
          experience: emp.experience,
        };
      }) ||
      Array(enquiryData?.number_of_employees || 1).fill({
        name: "",
        gender: "",
        qualification: "",
        designation: "",
        phone: "",
        whatsapp_number: null,
        email: "",
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
    payment_method: previousRegData?.payment_method || "upi",
    payment_details: {
      upi: previousRegData?.payment_details?.upi || {
        id: "",
        display_name: "",
        phone: "",
      },
      bank: previousRegData?.payment_details?.bank || {
        name: "",
        branch: "",
        ifsc: "",
        account_number: "",
      },
    },
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();

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

    // Prevent unusual inputs in start date
    if (name === "business_start_date") {
      const error = isValidStartDate(value);
      if (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          business_start_date: error,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          business_start_date: "",
        }));
      }
    }

    // Prevent unusual inputs in service_radius
    if (name === "service_radius") {
      const radius = parseInt(value);
      if (radius < 0 || radius > 1000) {
        return;
      }
    }

    // Prevent unusual inputs in mobile
    if (name === "whatsapp_number" || name === "payment_details.upi.phone") {
      if (value.length > 10) {
        return;
      }
    }

    // Prevent unusual inputs in TIN
    if (name === "tax_id") {
      if (value.length > 11) {
        return;
      }
    }

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0] || null,
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

    // Show/hide error messages realtime
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`employees[${index}].${field}`]: `${field
          .split("_")
          .join(" ")} is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`employees[${index}].${field}`]: "",
      }));
    }

    // Prevent unusual inputs in mobile
    if (field === "phone" || field === "whatsapp_number") {
      if (value.length > 10) {
        return;
      }
    }

    updatedEmployees[index] = {
      ...updatedEmployees[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      employees: updatedEmployees,
    }));
  };

  // Validate employees
  const validateEmployees = (errors) => {
    formData.employees.forEach((employee, index) => {
      if (!employee.name?.trim())
        errors[`employees[${index}].name`] = "Required";
      else if (!employee.name?.match(/^[a-zA-Z\s]+$/))
        errors[`employees[${index}].name`] = "Invalid name";
      if (!employee.phone?.match(/^\d{10}$/))
        errors[`employees[${index}].phone`] = "Required";
      if (!employee.email?.trim() === "" || !employee.email)
        errors[`employees[${index}].email`] = "Required";
      else if (!employee.email?.match(/^\S+@\S+\.\S+$/))
        errors[`employees[${index}].email`] = "Invalid email";
      if (!employee.gender) errors[`employees[${index}].gender`] = "Required";
    });

    if (Object.keys(errors).length === 0) {
      const emails = new Set();
      formData.employees.forEach((employee, index) => {
        if (emails.has(employee.email)) {
          errors[`employees[${index}].email`] = "Email already used";
        } else {
          emails.add(employee.email);
        }
      });

      const phones = new Set();
      formData.employees.forEach((employee, index) => {
        if (phones.has(employee.phone)) {
          errors[`employees[${index}].phone`] = "Phone number already used";
        } else {
          phones.add(employee.phone);
        }
      });
    }

    return errors;
  };

  const isValidStartDate = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);

    if (start > today) return "Start date cannot be in the future";
    if (start.getFullYear() < today.getFullYear() - 200)
      return "Invalid start date";
  };

  const validateStep = (stepNumber) => {
    let newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.business_registration_number?.trim())
          newErrors.business_registration_number = "Required";
        if (!formData.tax_id?.trim()) newErrors.tax_id = "Required";
        else if (!formData.tax_id?.match(/^\d{11}$/))
          newErrors.tax_id = "Invalid TIN";
        if (!formData.whatsapp_number?.match(/^\d{10}$/))
          newErrors.whatsapp_number = "Required";
        if (!formData.business_start_date)
          newErrors.business_start_date = "Required";
        else {
          const error = isValidStartDate(formData.business_start_date);
          if (error) newErrors.business_start_date = error;
        }
        break;
      case 2:
        if (!formData.service_radius || formData.service_radius === 0)
          newErrors.service_radius = "Required";
        if (!formData.exact_address?.trim())
          newErrors.exact_address = "Required";
        break;
      case 3:
        newErrors = validateEmployees(newErrors);
        break;
      case 4:
        if (isReRegistration) {
          if (
            !formData.documents.business_registration &&
            rejectedFields.includes("business_registration")
          )
            newErrors.business_registration = "Required";
          if (
            !formData.documents.address_proof &&
            rejectedFields.includes("address_proof")
          )
            newErrors.address_proof = "Required";
          if (
            !formData.documents.terms_acceptance &&
            rejectedFields.includes("terms_acceptance")
          )
            newErrors.terms_acceptance = "Required";
          if (
            !formData.documents.agreement &&
            rejectedFields.includes("agreement")
          )
            newErrors.agreement = "Required";
        } else {
          if (!formData.documents.business_registration)
            newErrors.business_registration = "Required";
          if (!formData.documents.address_proof)
            newErrors.address_proof = "Required";
          if (!formData.documents.terms_acceptance)
            newErrors.terms_acceptance = "Required";
          if (!formData.documents.agreement) newErrors.agreement = "Required";
        }
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
          formData[key] !== null &&
          key !== "business_start_date"
        ) {
          formDataToSend.append(
            key,
            typeof formData[key] === "object"
              ? JSON.stringify(formData[key])
              : formData[key]
          );
        } else if (key === "business_start_date") {
          const dateString = formData[key]?.toISOString().split("T")[0];
          formDataToSend.append(key, dateString);
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

      if (response?.provider_id) {
        // Handle success
        toast({
          title: "Success!",
          description: "Your registration was submitted successfully.",
          variant: "default",
        });
      }

      router.push("/service-provider/register/sucess");
    } catch (error) {
      console.error("Registration error:", error);

      const validationErrors = error.response?.data?.validation;
      let validationErrorString = "";
      if (validationErrors?.length) {
        validationErrors.forEach((error) => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [error.field]: error.message,
          }));

          validationErrorString += `${error.message}\n`;
        });
      }

      const errorMessage =
        validationErrorString !== ""
          ? validationErrorString
          : error.response?.data?.details ||
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
          onFileRemove={() => handleRemoveFile(name)}
          disabled={isReRegistration && !rejectedFields.includes(name)}
        />

        {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
      </div>
    );
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
            disabled={isReRegistration && !rejectedFields.includes("tax_id")}
            placeholder="Tax Identification Number*"
            className={`p-2 border rounded w-full ${
              errors.tax_id ? "border-red-500 bg-red-500/5 text-red-500" : ""
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
            disabled={previousRegData.business_registration_number}
            value={formData.business_registration_number}
            onChange={handleChange}
            placeholder="Business Registration Number*"
            className={`p-2 border rounded w-full ${
              errors.business_registration_number
                ? "border-red-500 bg-red-500/5 text-red-500"
                : ""
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
            type="number"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            disabled={
              isReRegistration && !rejectedFields.includes("whatsapp_number")
            }
            onChange={handleChange}
            placeholder="WhatsApp Number*"
            className={`p-2 border rounded w-full ${
              errors.whatsapp_number
                ? "border-red-500 bg-red-500/5 text-red-500"
                : ""
            }`}
          />
          {errors.whatsapp_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.whatsapp_number}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Business Start Date
        </label>

        <div
          className={cn(
            "flex items-center gap-2 border px-3 rounded-md focus-within:ring-2 focus-within:ring-blue-500",
            {
              "bg-red-500/5 border border-red-500 text-red-500":
                errors.business_start_date,
            }
          )}
        >
          <CalendarSearch className="size-5" />

          <DatePicker
            selected={formData.business_start_date}
            minDate={maxStartDate}
            maxDate={minStartDate}
            disabled={
              isReRegistration &&
              !rejectedFields.includes("business_start_date")
            }
            placeholderText="mm/dd/yyyy"
            onChange={(date) =>
              handleChange({
                target: { name: "business_start_date", value: date },
              })
            }
            wrapperClassName="w-full"
            className="w-full bg-transparent h-10 focus:outline-none"
          />
        </div>

        {errors.business_start_date && (
          <p className="text-red-500 text-sm mt-1">
            {errors.business_start_date}
          </p>
        )}
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
            disabled={
              isReRegistration && !rejectedFields.includes("service_radius")
            }
            onChange={handleChange}
            placeholder="Service Radius (km)*"
            className={`p-2 border rounded w-full ${
              errors.service_radius
                ? "border-red-500 bg-red-500/5 text-red-500"
                : ""
            }`}
          />
          {errors.service_radius && (
            <p className="text-red-500 text-sm mt-1">{errors.service_radius}</p>
          )}
        </div>
      </div>
      <div>
        <textarea
          name="exact_address"
          value={formData.exact_address}
          disabled={
            isReRegistration && !rejectedFields.includes("exact_address")
          }
          onChange={handleChange}
          placeholder="Business Address*"
          className={`w-full p-2 border rounded ${
            errors.exact_address
              ? "border-red-500 bg-red-500/5 text-red-500"
              : ""
          }`}
          rows="3"
        />
        {errors.exact_address && (
          <p className="text-red-500 text-sm mt-1">{errors.exact_address}</p>
        )}
      </div>
    </div>
  );

  // // Remove employee
  // const handleRemoveEmployee = (index) => {
  //   const updatedEmployees = formData.employees.filter(
  //     (_, empIndex) => empIndex !== index
  //   );
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     employees: updatedEmployees,
  //   }));
  // };

  // // Add employee
  // const handleAddEmployee = () => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     employees: [...prevData.employees, {}], // Add an empty employee object
  //   }));
  // };

  const renderEmployeeDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Employee Details</h2>

      {formData.employees.map((employee, index) => (
        <div key={index} className="p-4 border rounded space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Employee {index + 1}</h3>
            <p>
              {index + 1} of {formData.employees.length}
            </p>
            {/* {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveEmployee(index)}
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
                disabled={
                  previousRegData.ServiceProviderEmployees &&
                  !rejectedFields.includes("ServiceProviderEmployees")
                }
                onChange={(e) =>
                  handleEmployeeChange(index, "name", e.target.value)
                }
                placeholder="Employee Name*"
                className={`p-2 border rounded w-full ${
                  errors[`employees.${index}.name`]
                    ? "border-red-500 bg-red-500/5 text-red-500"
                    : ""
                }`}
              />
              {errors[`employees.${index}.name`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`employees.${index}.name`]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <select
                value={employee.gender}
                disabled={
                  isReRegistration &&
                  !rejectedFields.includes("ServiceProviderEmployees")
                }
                onChange={(e) =>
                  handleEmployeeChange(index, "gender", e.target.value)
                }
                className={cn("p-2 border rounded w-full h-11", {
                  "border-red-500 bg-red-500/5 text-red-500":
                    errors[`employees.${index}.gender`],
                })}
              >
                <option value="">Select Gender*</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              {errors[`employees.${index}.gender`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`employees.${index}.gender`]}
                </p>
              )}
            </div>

            <input
              type="text"
              disabled={
                isReRegistration &&
                !rejectedFields.includes("ServiceProviderEmployees")
              }
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
              disabled={
                isReRegistration &&
                !rejectedFields.includes("ServiceProviderEmployees")
              }
              onChange={(e) =>
                handleEmployeeChange(index, "designation", e.target.value)
              }
              placeholder="Designation"
              className="p-2 border rounded w-full"
            />

            <div>
              <input
                type="number"
                disabled={
                  isReRegistration &&
                  !rejectedFields.includes("ServiceProviderEmployees")
                }
                value={employee.phone}
                onChange={(e) =>
                  handleEmployeeChange(index, "phone", e.target.value)
                }
                placeholder="Phone Number*"
                className={`p-2 border rounded w-full ${
                  errors[`employees[${index}].phone`]
                    ? "border-red-500 bg-red-500/5 text-red-500"
                    : ""
                }`}
              />
              {errors[`employees[${index}].phone`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`employees[${index}].phone`]}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                disabled={
                  isReRegistration &&
                  !rejectedFields.includes("ServiceProviderEmployees")
                }
                value={employee.email}
                required
                onChange={(e) =>
                  handleEmployeeChange(index, "email", e.target.value)
                }
                placeholder="Email*"
                className={`p-2 border rounded w-full h-11 ${
                  errors[`employees[${index}].email`]
                    ? "border-red-500 bg-red-500/5 text-red-500"
                    : ""
                }`}
              />
              {errors[`employees[${index}].email`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`employees[${index}].email`]}
                </p>
              )}
            </div>

            <input
              type="number"
              disabled={
                isReRegistration &&
                !rejectedFields.includes("ServiceProviderEmployees")
              }
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
        onClick={handleAddEmployee}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Employee
      </button> */}
    </div>
  );

  const renderDocuments = () => (
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

      <p className="py-2">
        Supported File Types: PDF, JPG, PNG, doc/docx (2MB max file size for
        each)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {renderFileInput(
          "business_registration",
          "Business Registration Document",
          true
        )}
        {renderFileInput("address_proof", "Address Proof", true)}
        {renderFileInput("insurance", "Employee Insurance Documents")}
        {renderFileInput("terms_acceptance", "Signed Terms & Conditions", true)}
        {renderFileInput("agreement", "Signed Service Agreement", true)}
        {renderFileInput("logo", "Business Logo")}
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
          <div>
            <input
              type="text"
              name="payment_details.upi.id"
              value={formData.payment_details.upi.id}
              disabled={
                isReRegistration && !rejectedFields.includes("payment_details")
              }
              onChange={handleChange}
              placeholder="UPI ID*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.upi.id"]
                  ? "border-red-500 bg-red-500/5 text-red-500"
                  : ""
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
              disabled={
                isReRegistration && !rejectedFields.includes("payment_details")
              }
              onChange={handleChange}
              placeholder="Display Name*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.upi.display_name"]
                  ? "border-red-500 bg-red-500/5 text-red-500"
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
              type="number"
              name="payment_details.upi.phone"
              value={formData.payment_details.upi.phone}
              disabled={
                isReRegistration && !rejectedFields.includes("payment_details")
              }
              onChange={handleChange}
              placeholder="UPI Phone Number*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.upi.phone"]
                  ? "border-red-500 bg-red-500/5 text-red-500"
                  : ""
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
              disabled={
                isReRegistration && !rejectedFields.includes("payment_details")
              }
              onChange={handleChange}
              placeholder="Bank Name*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.name"]
                  ? "border-red-500 bg-red-500/5 text-red-500"
                  : ""
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
              disabled={
                isReRegistration && !rejectedFields.includes("payment_details")
              }
              onChange={handleChange}
              placeholder="Branch*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.branch"]
                  ? "border-red-500 bg-red-500/5 text-red-500"
                  : ""
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
              disabled={
                isReRegistration && !rejectedFields.includes("payment_details")
              }
              onChange={handleChange}
              placeholder="IFSC Code*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.ifsc"]
                  ? "border-red-500 bg-red-500/5 text-red-500"
                  : ""
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
              disabled={
                isReRegistration && !rejectedFields.includes("payment_details")
              }
              onChange={handleChange}
              placeholder="Account Number*"
              className={`w-full p-2 border rounded ${
                errors["payment_details.bank.account_number"]
                  ? "border-red-500 text-red-500 bg-red-500/5"
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
        {loading && (
          <LoadingScreen message={"Registration Application Submitting...."} />
        )}
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
            {step < 5 && (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
              >
                Next
              </button>
            )}

            {step === 5 && (
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
