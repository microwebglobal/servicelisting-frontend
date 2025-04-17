"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { providerAPI } from "@/api/provider";
import { AlertCircle, CheckCircle, PenBoxIcon, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProviderDetails from "@components/ProviderDetails";
import ProviderDocuments from "./ProviderDocuments";
import Modal from "react-modal";
import { toast } from "@hooks/use-toast";
import Select from "react-select";
import TableActionsMenu from "../menus/TableActionsMenu";
import CopyToClipboard from "../CopyToClipboard";

// Rejectable fields
const individualRejectableFields = [
  { value: "aadhar_number", label: "Aadhar Number" },
  { value: "aadhar", label: "Aadhar Card" },
  { value: "pan_number", label: "PAN Number" },
  { value: "pan", label: "PAN Card" },
  { value: "id_proof", label: "ID Proof" },
  { value: "address_proof", label: "Address Proof" },
  { value: "qualification_proof", label: "Qualification Proof" },
  { value: "service_certificate", label: "Service Certificates" },
  { value: "insurance", label: "Insurance Documents" },
  { value: "agreement", label: "Signed Agreement" },
  { value: "terms_acceptance", label: "Signed Terms & Conditions" },
  { value: "logo", label: "Business Logo" },
  { value: "business_registration", label: "Business Registration Document" },
  { value: "payment_details", label: "Payment Details" },
  { value: "nationality", label: "Nationality" },
  { value: "phone", label: "Phone Number" },
  { value: "languages_spoken", label: "Languages Spoken" },
  { value: "whatsapp_number", label: "WhatsApp Number" },
  { value: "alternate_number", label: "Alternate Number" },
  { value: "exact_address", label: "Business Address" },
  { value: "availability_hours", label: "Availability Hours" },
  { value: "specializations", label: "Specializations" },
  { value: "profile_bio", label: "Profile Bio" },
  { value: "qualifications", label: "Qualifications" },
];

const businessRejectableFields = [
  { value: "tax_id", label: "Tax Identification Number" },
  {
    value: "business_registration_number",
    label: "Business Registration Number",
  },
  { value: "whatsapp_number", label: "WhatsApp Number" },
  { value: "business_start_date", label: "Business Start Date" },
  { value: "service_radius", label: "Service Radius" },
  { value: "exact_address", label: "Business Address" },
  { value: "ServiceProviderEmployees", label: "Service Employee Details" },
  { value: "payment_details", label: "Payment Details" },
  { value: "business_registration", label: "Business Registration Document" },
  { value: "address_proof", label: "Address Proof" },
  { value: "insurance", label: "Employee Insurance Documents" },
  { value: "agreement", label: "Signed Agreement" },
  { value: "terms_acceptance", label: "Signed Terms & Conditions" },
  { value: "logo", label: "Business Logo" },
];

const getDisplayValue = (value, defaultValue = "N/A") => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : defaultValue;
  }
  return value || defaultValue;
};

const formatLocation = (location) => {
  try {
    if (typeof location === "string") {
      const parsed = JSON.parse(location);
      if (parsed.coordinates) {
        return `${parsed.coordinates[1].toFixed(
          4
        )}, ${parsed.coordinates[0].toFixed(4)}`;
      }
    } else if (location?.coordinates) {
      return `${location.coordinates[1].toFixed(
        4
      )}, ${location.coordinates[0].toFixed(4)}`;
    }
  } catch (e) {
    return location || "No location data";
  }
  return "No location data";
};

const ProviderManager = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDocDialogOpen, setDocIsDialogOpen] = useState(false);
  const [businessTypeFilter, setBusinessTypeFilter] = useState("");
  const [sortDate, setSortDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [tabValue, setTabValue] = useState("pending_approval");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectingProvider, setRejectingProvider] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approveProvider, setApproveProvider] = useState({
    providerId: null,
    status: null,
  });
  // Rejected fields
  const [rejectedFields, setRejectedFields] = useState([]);
  const [registrationLink, setRegistrationLink] = useState(null);

  console.log(rejectingProvider);

  useEffect(() => {
    fetchProviders();
  }, [isDialogOpen, isDocDialogOpen]);

  const handleReject = async () => {
    if (!rejectionReason) {
      toast({
        title: "Please enter a rejection reason.",
        variant: "destructive",
      });
      return;
    }

    if (rejectedFields.length === 0) {
      toast({
        title: "Please select at least one rejected field.",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleStatusUpdate(
        rejectingProvider.provider_id,
        "rejected",
        rejectionReason,
        rejectedFields
      );
    } catch (error) {
      console.error("Error rejecting provider:", error);
    }
  };

  const openConfirmModal = (providerId, status) => {
    setApproveProvider({ providerId, status });
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
  };

  const closeRejectModal = () => {
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    setRejectingProvider(null);
    setRejectedFields([]);
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

  const handleStatusUpdate = async (
    providerId,
    newStatus,
    rejectionReason = null,
    rejectedFields = [],
    providerType = null
  ) => {
    try {
      setIsApproving(true);
      const updateData = {
        status: newStatus,
      };

      if (newStatus === "rejected") {
        if (!rejectionReason) {
          setRejectingProvider({
            provider_id: providerId,
            provider_type: providerType,
          });
          setIsRejectDialogOpen(true);
          return;
        }

        updateData.rejection_reason = rejectionReason;

        // Add rejected fields
        if (rejectedFields.length > 0) {
          updateData.rejected_fields = rejectedFields;
        }
      }

      await providerAPI
        .updateProvider(providerId, updateData)
        .then((res) => setRegistrationLink(res.data.registration_link));

      const updatedProviders = providers.map((provider) =>
        provider.provider_id === providerId
          ? {
              ...provider,
              status: newStatus,
              ...(newStatus === "rejected"
                ? { rejection_reason: rejectionReason }
                : {}),
            }
          : provider
      );

      setProviders(updatedProviders);
      setFilteredProviders(updatedProviders);

      if (newStatus === "rejected") {
        setRejectionReason("");
        setRejectingProvider(null);
      }

      toast({
        title: "Success!",
        description: "Service Provider Updated Sucessfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating provider status:", error);
      toast({
        title: "Error",
        description: "Failed to update provider status!",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
      closeConfirmModal();
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

  const handleUpdateProvider = (updatedProvider) => {
    console.log("Updated", updatedProvider);
    setFilteredProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider.provider_id === updatedProvider.provider_id
          ? { ...updatedProvider }
          : provider
      )
    );
    console.log(filteredProviders);
  };

  const handleDeleteProvider = async (provider) => {
    try {
      await providerAPI.deleteProvider(provider.provider_id);

      setFilteredProviders((prevProviders) =>
        prevProviders.filter(
          (provider) => provider.provider_id !== provider.provider_id
        )
      );

      toast({
        title: "Success!",
        description: "Provider deleted successfully!",
        variant: "default",
      });

      console.log("Deleted", provider);
    } catch (error) {
      console.error("Error deleting provider:", error);

      toast({
        title: "Error",
        description: "Failed to delete provider!",
        variant: "destructive",
      });
    }
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
            <TabsTrigger value="active">
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
                  <TableCell>
                    {getDisplayValue(
                      provider.business_name || provider?.User.name
                    )}
                  </TableCell>
                  <TableCell className="capitalize">
                    {getDisplayValue(provider.business_type)}
                  </TableCell>
                  <TableCell>
                    {formatLocation(provider.primary_location)}
                  </TableCell>
                  <TableCell>{provider.years_experience || 0} years</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        provider.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : provider.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {provider.status}
                    </span>
                  </TableCell>

                  <TableCell className="w-56">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProvider(provider);
                          setDocIsDialogOpen(true);
                        }}
                      >
                        Docs
                      </Button>

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
                              openConfirmModal(provider.provider_id, "active")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(
                                provider.provider_id,
                                "rejected",
                                null,
                                [],
                                provider.business_type
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <TableActionsMenu
                      moduleName="provider"
                      onConfirm={() => handleDeleteProvider(provider)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDocDialogOpen} onOpenChange={setDocIsDialogOpen}>
        <DialogContent className="max-w-7xl justify-center items-center">
          <DialogHeader>
            <div className="flex gap-10">
              <DialogTitle className="font-bold text-center justify-center text-3xl">
                Provider Documents
              </DialogTitle>
            </div>
          </DialogHeader>
          {selectedProvider && (
            <ProviderDocuments
              provider={selectedProvider}
              onCloseDialog={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setIsEditing(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex gap-10">
              <DialogTitle className="font-bold text-3xl">
                Provider Details
              </DialogTitle>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <PenBoxIcon />
                </Button>
              )}
            </div>
          </DialogHeader>
          {selectedProvider && (
            <ProviderDetails
              provider={selectedProvider}
              isEditing={isEditing}
              onCloseDialog={() => {
                setIsDialogOpen(false);
                setIsEditing(false);
              }}
              onUpdateProvider={handleUpdateProvider}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectDialogOpen}
        onRequestClose={closeRejectModal}
        ariaHideApp={false}
        className="m-10 bg-white p-8 rounded-lg shadow-xl w-96 max-w-lg"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
      >
        {registrationLink ? (
          <div className="space-y-4">
            <p className="font-semibold">Registration link:</p>
            <CopyToClipboard value={registrationLink} />

            <Button
              type="button"
              className="flex-1"
              onClick={closeRejectModal}
              disabled={isApproving}
            >
              Dismiss
            </Button>
          </div>
        ) : (
          <div className="space-y-4 z-50">
            <p className="text-lg font-semibold">
              Reject Provider Registration
            </p>

            <Select
              isMulti
              placeholder="Select rejected fields"
              value={rejectedFields}
              onChange={setRejectedFields}
              options={
                rejectingProvider?.provider_type === "individual"
                  ? individualRejectableFields
                  : businessRejectableFields
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rejection Reason
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border p-2 shadow-sm"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeRejectModal}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={
                  !rejectionReason.trim() ||
                  rejectedFields.length === 0 ||
                  isApproving
                }
              >
                {isApproving ? "Rejecting..." : "Reject Registration "}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onRequestClose={closeConfirmModal}
        ariaHideApp={false}
        className="m-10 bg-white p-8 rounded-lg shadow-xl w-96 max-w-lg"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
      >
        {registrationLink ? (
          <div className="space-y-4">
            <p className="font-semibold">Registration link:</p>
            <CopyToClipboard value={registrationLink} />

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={closeConfirmModal}
              disabled={isApproving}
            >
              Dismiss
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Are you sure you want to approve this provider?</p>
            <div className="flex space-x-4">
              <Button
                className="flex-1"
                onClick={() =>
                  handleStatusUpdate(
                    approveProvider.providerId,
                    approveProvider.status
                  )
                }
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Confirm"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={closeConfirmModal}
                disabled={isApproving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProviderManager;
