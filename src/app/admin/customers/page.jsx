"use client";
import { profileAPI } from "@/api/profile";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [search, customers]);

  const fetchAllCustomers = async () => {
    try {
      const response = await profileAPI.getAllCustomers();
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    const lowerSearch = search.toLowerCase();
    setFilteredCustomers(
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowerSearch) ||
          customer.account_status.toLowerCase().includes(lowerSearch)
      )
    );
  };

  const updateCustomerStatus = async (newStatus) => {
    if (!selectedCustomer) return;

    try {
      await profileAPI.updateCustomerProfileStatus(selectedCustomer.u_id, {
        status: newStatus,
      });

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.u_id === selectedCustomer.u_id
            ? { ...customer, account_status: newStatus }
            : customer
        )
      );
      setSelectedCustomer((prevSelectedCustomer) => ({
        ...prevSelectedCustomer,
        account_status: newStatus,
      }));
      setStatus(newStatus);
    } catch (err) {
      setError("Failed to update customer status.");
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center ">
      <Card className="w-full max-w-6xl shadow-lg rounded-lg bg-white">
        <CardHeader className="flex justify-between px-6 py-4 border-b">
          <CardTitle className="text-3xl font-semibold text-gray-800">
            Customers
          </CardTitle>
          <Input
            placeholder="Search by Name, or Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full border rounded-lg shadow-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-2 text-left">ID</TableHead>
                    <TableHead className="px-4 py-2 text-left">Name</TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Acc Balance
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Mobile
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Last Login
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.u_id}
                        className="border-b hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <TableCell className="px-4 py-3 text-sm text-gray-700">
                          {customer.u_id}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {customer.acc_balance || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                          {customer.mobile}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full 
                            ${
                              customer.account_status === "active"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {customer.account_status}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-600">
                          {new Date(customer.last_login).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCustomer && (
        <Dialog
          open={!!selectedCustomer}
          onOpenChange={() => setSelectedCustomer(null)}
        >
          <DialogContent className="max-w-md p-8 rounded-lg shadow-xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800 mb-4">
                Customer Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3 grid grid-rows-1">
                <Label className="text-sm font-medium text-gray-600">
                  <strong>ID:</strong> {selectedCustomer.u_id}
                </Label>
                <Label className="text-sm font-medium text-gray-600">
                  <strong>Name:</strong> {selectedCustomer.name}
                </Label>
                <Label className="text-sm font-medium text-gray-600">
                  <strong>Email:</strong> {selectedCustomer.email || "N/A"}
                </Label>
                <Label className="text-sm font-medium text-gray-600">
                  <strong>Mobile:</strong> {selectedCustomer.mobile}
                </Label>
                <Label className="text-sm font-medium text-gray-600">
                  <strong>Account Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedCustomer.account_status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedCustomer.account_status}
                  </span>
                </Label>
                <Label className="text-sm font-medium text-gray-600">
                  <strong>Last Login:</strong>{" "}
                  {new Date(selectedCustomer.last_login).toLocaleString()}
                </Label>
                <Label className="text-sm font-medium text-gray-600">
                  <strong>Balance:</strong> {selectedCustomer.acc_balance}
                </Label>
              </div>

              {/* Change Status Dropdown */}
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  <strong>Change Status:</strong>
                </Label>
                <Select
                  value={status}
                  onValueChange={(newStatus) => setStatus(newStatus)}
                  className="w-full"
                >
                  <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400">
                    <button>{status || "Select Status"}</button>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedCustomer(null)}
                className="w-1/2 py-2 text-gray-700 border border-gray-300"
              >
                Close
              </Button>
              <Button
                className="w-1/2 py-2 text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => updateCustomerStatus(status)}
              >
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomersPage;
