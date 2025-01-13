"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerAPI } from "@/api/provider";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const getDisplayValue = (value, defaultValue = 'N/A') => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : defaultValue;
  }
  return value || defaultValue;
};

const formatLocation = (location) => {
  try {
    if (typeof location === 'string') {
      const parsed = JSON.parse(location);
      if (parsed.coordinates) {
        return `${parsed.coordinates[1].toFixed(4)}, ${parsed.coordinates[0].toFixed(4)}`;
      }
    } else if (location?.coordinates) {
      return `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`;
    }
  } catch (e) {
    return location || 'No location data';
  }
  return 'No location data';
};

const ProviderDetails = ({ provider }) => {
  const getDisplayValue = (value, defaultValue = 'N/A') => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : defaultValue;
    }
    return value || defaultValue;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Business/Individual Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold border-b pb-2">
          {provider.business_type === 'business' ? 'Business Details' : 'Individual Details'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{getDisplayValue(provider.business_name)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium capitalize">{getDisplayValue(provider.business_type)}</p>
          </div>
          {provider.business_type === 'business' && (
            <div>
              <p className="text-sm text-gray-500">Registration Number</p>
              <p className="font-medium">{getDisplayValue(provider.business_registration_number)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{formatLocation(provider.primary_location)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Service Radius</p>
            <p className="font-medium">{provider.service_radius || 0}km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Languages Spoken</p>
            <p className="font-medium">{getDisplayValue(provider.languages_spoken)}</p>
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold border-b pb-2">Professional Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-medium">{provider.years_experience || 0} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Specializations</p>
            <p className="font-medium">{getDisplayValue(provider.specializations)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Qualification</p>
            <p className="font-medium">{getDisplayValue(provider.qualification)}</p>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold border-b pb-2">Service Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Availability</p>
            <p className="font-medium capitalize">{getDisplayValue(provider.availability_type)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-medium uppercase">{getDisplayValue(provider.payment_method)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderManager = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businessTypeFilter, setBusinessTypeFilter] = useState("");
  const [sortDate, setSortDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [tabValue, setTabValue] = useState("pending_approval");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectingProvider, setRejectingProvider] = useState(null);
  useEffect(() => {
    fetchProviders();
  }, []);
  
  
  const handleReject = async () => {
    try {
      await handleStatusUpdate(rejectingProvider.provider_id, "rejected", rejectionReason);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setRejectingProvider(null);
    } catch (error) {
      console.error("Error rejecting provider:", error);
    }
  };


  const fetchProviders = async () => {
    try {
      const response = await providerAPI.getProviders();
      const formattedProviders = response.data.map((provider) => ({
        ...provider,
        languages_spoken: Array.isArray(provider.languages_spoken)
          ? provider.languages_spoken
          : [],
        specializations: Array.isArray(provider.specializations)
          ? provider.specializations
          : [],
        business_name: String(provider.business_name || ""),
        business_type: String(provider.business_type || ""),
        years_experience: Number(provider.years_experience || 0),
        status: String(provider.status || "pending_approval"),
      }));
      setProviders(formattedProviders);
      setFilteredProviders(formattedProviders);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const handleStatusUpdate = async (providerId, newStatus, rejectionReason = null) => {
    try {
      const updateData = {
        status: newStatus
      };
      
      if (newStatus === 'rejected') {
        if (!rejectionReason) {
          setRejectingProvider({ provider_id: providerId });
          setIsRejectDialogOpen(true);
          return;
        }
        updateData.rejection_reason = rejectionReason;
      }
  
      await providerAPI.updateProvider(providerId, updateData);
      
      const updatedProviders = providers.map((provider) =>
        provider.provider_id === providerId
          ? { 
              ...provider, 
              status: newStatus,
              ...(newStatus === 'rejected' ? { rejection_reason: rejectionReason } : {})
            }
          : provider
      );
      
      setProviders(updatedProviders);
      setFilteredProviders(updatedProviders);
      
      if (newStatus === 'rejected') {
        setRejectionReason("");
        setIsRejectDialogOpen(false);
        setRejectingProvider(null);
      }
    } catch (error) {
      console.error("Error updating provider status:", error);
    }
  };

  const filterProviders = () => {
    let filtered = providers;

    // Filter by status tab
    filtered = filtered.filter((provider) => provider.status === tabValue);

    // Filter by business type
    if (businessTypeFilter) {
      filtered = filtered.filter(
        (provider) => provider.business_type === businessTypeFilter
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(
        (provider) =>
          new Date(provider.created_at).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      );
    }

    // Sort by date
    if (sortDate) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortDate === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    setFilteredProviders(filtered);
  };

  useEffect(() => {
    filterProviders();
  }, [tabValue, businessTypeFilter, sortDate, selectedDate, providers]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList>
            <TabsTrigger value="pending_approval">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pending Approval
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <XCircle className="w-4 h-4 mr-2" />
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-4">
          <select
            value={businessTypeFilter}
            onChange={(e) => setBusinessTypeFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded"
          />

          <Button
            onClick={() => setSortDate(sortDate === "asc" ? "desc" : "asc")}
            variant="outline"
          >
            Sort by Date {sortDate === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.provider_id}>
                  <TableCell>{getDisplayValue(provider.business_name)}</TableCell>
                  <TableCell className="capitalize">{getDisplayValue(provider.business_type)}</TableCell>
                  <TableCell>
                    {formatLocation(provider.primary_location)}
                  </TableCell>
                  <TableCell>{provider.years_experience || 0} years</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${provider.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : provider.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {provider.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProvider(provider);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      {provider.status === "pending_approval" && (
                        <>
                          <Button
                            variant="default"
                            onClick={() =>
                              handleStatusUpdate(provider.provider_id, "approved")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(provider.provider_id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          {selectedProvider && <ProviderDetails provider={selectedProvider} />}
        </DialogContent>
      </Dialog>
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Provider Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rejection Reason
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Registration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderManager;