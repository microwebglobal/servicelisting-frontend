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
import { FormDialog } from "@/components/FormDialog";
import { useDialog } from "../../src/hooks/useDialog";

const ProviderManager = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businessTypeFilter, setBusinessTypeFilter] = useState("");
  const [sortDate, setSortDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [tabValue, setTabValue] = useState("pending_approval");
  const { dialogState, handleDialog } = useDialog();

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleDialogAction = (type, mode, item = null) => {
    console.log(type, mode, item);

    handleDialog.open(type, mode, item);
  };

  const handleDialogClose = () => {
    const { type } = dialogState;
    handleDialog.close();

    console.log(dialogState);
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
    rejectionReason = null
  ) => {
    try {
      const updateData = {
        status: newStatus,
      };

      if (newStatus === "rejected") {
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
                  <TableCell>{provider.business_name}</TableCell>
                  <TableCell className="capitalize">
                    {provider.business_type}
                  </TableCell>
                  <TableCell>
                    {typeof provider.primary_location === "object"
                      ? JSON.stringify(provider.primary_location)
                      : provider.primary_location}
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
                              handleStatusUpdate(
                                provider.provider_id,
                                "approved"
                              )
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDialogAction(
                                provider.provider_id,
                                "rejected"
                              )
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

      <FormDialog
        dialogState={dialogState}
        onClose={handleDialogClose}
        onAction={handleDialogAction}
      />
    </div>
  );
};

export default ProviderManager;
