"use client";
import React, { useEffect, useState } from "react";
import { toast } from "@hooks/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@components/ui/input";
import Select from "react-select";
import { DeleteForeverOutlined } from "@/node_modules/@mui/icons-material";
import { providerAPI } from "@api/provider";
import { serviceAPI } from "@/api/services";
import { Delete, DotIcon, Edit, Eye, PlusCircle, Recycle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@components/ui/button";

const EmployeeDetailsModal = ({ employee }) => {
  if (!employee) return null;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Employee Details - {employee.employee_id}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        {/* User Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Employee Information</h3>
            <p>Name: {employee.User?.name}</p>
            <p>Email: {employee.User?.email}</p>
            <p>Phone: {employee.User?.mobile}</p>
            <p>NIC: {employee.User?.nic}</p>
            <p>Gender: {employee.User?.gender}</p>
            <p>
              Date of Birth: {new Date(employee.User?.dob).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Job Details</h3>
            <p>Role: {employee.role}</p>
            <p>Qualification: {employee.qualification}</p>
            <p>Experience: {employee.years_experience} years</p>
            <p>Status: {employee.status}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

const EmployeeFormModal = ({ employee, onSubmit, onClose }) => {
  const [citiesOptions, setCitiesOpions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      nic: "",
      gender: "Male",
      dob: "",
      role: "",
      qualification: "",
      years_experience: "",
      status: "active",
      serviceCategories: [],
    },
  });

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
    fetchCities();
  }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (employee) {
      reset({
        name: employee.User?.name || "",
        email: employee.User?.email || "",
        mobile: employee.User?.mobile || "",
        nic: employee.User?.nic || "",
        gender: employee.User?.gender || "Male",
        dob: employee.User?.dob || "",
        role: employee.role || "",
        qualification: employee.qualification || "",
        years_experience: employee.years_experience || "",
        status: employee.status || "active",
      });
    }
  }, [employee, reset]);

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      cities: selectedCities,
    };
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {employee ? "Edit Employee" : "Add New Employee"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
        {/* User Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Name</label>
            <Input {...register("name", { required: "Name is required" })} />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Phone</label>
            <Input {...register("mobile", { required: "Phone is required" })} />
            {errors.mobile && (
              <p className="text-red-500">{errors.mobile.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">NIC</label>
            <Input {...register("nic")} />
          </div>
          <div>
            <label className="block font-semibold">Date of Birth</label>
            <Input type="date" {...register("dob")} />
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Role</label>
            <Input {...register("role", { required: "Role is required" })} />
            {errors.role && (
              <p className="text-red-500">{errors.role.message}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Qualification</label>
            <Input
              {...register("qualification", {
                required: "Qualification is required",
              })}
            />
          </div>
          <div>
            <label className="block font-semibold">Experience (Years)</label>
            <Input
              type="number"
              {...register("years_experience", { required: "Required" })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" onClick={onClose} className="bg-gray-400">
            Cancel
          </Button>
          <Button type="submit">
            {employee ? "Update Employee" : "Add Employee"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

const Page = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [provider, setProvider] = useState();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    setProvider(user);
    const fetchProviderData = async () => {
      try {
        const response = await providerAPI.getProviderEmployees(
          user?.providerId
        );
        console.log(response.data);
        setEmployeeData(response?.data);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchProviderData();
  }, [isEditFormOpen]);

  const handleEmployeeSubmit = async (data) => {
    if (selectedEmployee) {
      try {
        const response = await providerAPI.updateProviderEmployees(
          selectedEmployee?.employee_id,
          data
        );
        toast({
          title: "Success!",
          description: "Employee Successfully Updated!",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error Updating Employee!",
          variant: "destructive",
        });
        console.error("Error Updating Employee", error);
      }
    } else {
      try {
        const response = await providerAPI.addProviderEmployees(
          provider?.providerId,
          data
        );
        toast({
          title: "Success!",
          description: "New Employee Added Successfully!",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error Adding New Employee!",
          variant: "destructive",
        });
        console.error("Error Adding New Employee", error);
      }
    }
    setEditFormOpen(false);
  };
  return (
    <div className="mt-8">
      <div className="flex justify-between mb-2">
        <h1 className="text-3xl ml-10 font-bold text-gray-800">
          Business Employees
        </h1>

        <button
          type="button"
          onClick={() => setEditFormOpen(true)}
          className="bg-black mr-10 flex space-x-2 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
        >
          <PlusCircle />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="p-6 mt-10 ml-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {employeeData.map((employee) => (
          <div
            key={employee.employee_id}
            className="bg-gray-100 shadow-lg rounded-lg p-4 flex flex-col items-center text-center"
          >
            {/* Profile Image */}
            <img
              src={employee.User?.photo || "https://via.placeholder.com/100"}
              alt={employee.User?.name}
              className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
            />

            {/* Employee Info */}
            <h3 className="mt-3 font-semibold text-lg">
              {employee.User?.name}
            </h3>
            <p className="text-gray-600">{employee.role}</p>
            <p className="text-gray-500">{employee.User?.email}</p>
            <p className="text-gray-500">{employee.User?.mobile}</p>

            <div className="flex gap-4 mt-3">
              <Button
                onClick={() => {
                  setSelectedEmployee(employee);
                  setEditFormOpen(true);
                }}
              >
                <Edit className="text-white" />
              </Button>
              <Button
                onClick={() => {
                  setSelectedEmployee(employee);
                  setDialogOpen(true);
                }}
              >
                <Eye className="text-white" />
              </Button>
              <Button variant="destructive">
                <DeleteForeverOutlined className="text-white" />
              </Button>
            </div>
          </div>
        ))}
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <EmployeeDetailsModal employee={selectedEmployee} />
        </Dialog>
        <Dialog open={isEditFormOpen} onOpenChange={setEditFormOpen}>
          <EmployeeFormModal
            employee={selectedEmployee}
            onSubmit={handleEmployeeSubmit}
            onClose={() => setEditFormOpen(false)}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
