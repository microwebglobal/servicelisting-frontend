"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerAPI } from "@api/provider";
import InquiryPopup from "@components/popups/InquiryPopup";
import { toast } from "@hooks/use-toast";

const InquiryManager = () => {
  const [inquirys, setInqirys] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [businessTypeFilter, setBusinessTypeFilter] = useState("");
  const [sortDate, setSortDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleOpenModal = (inquiry) => {
    setIsOpen(true);
    setSelectedInquiry(inquiry);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const openConfirmModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
  };

  const openRejectModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setRejectReason("");
  };

  useEffect(() => {
    const fetchInquirys = async () => {
      try {
        const response = await providerAPI.getEnquiry();
        setInqirys(response.data);
        setFilteredInquiries(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("error fetching inquiries", error);
      }
    };

    fetchInquirys();
  }, []);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await providerAPI.approveEnquiry(selectedInquiry.enquiry_id);
      const updatedInquiries = inquirys.map((item) =>
        item.enquiry_id === selectedInquiry.enquiry_id
          ? { ...item, status: "approved" }
          : item
      );
      setInqirys(updatedInquiries);
      setConfirmModalOpen(false);
      toast({
        title: "Success!",
        description: "Service Provider Inquiry Approved Sucessfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("error in inquiry approve", error);
      toast({
        title: "Error",
        description: "Failed to approve Inquiry!",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const filterInquiries = () => {
    let filtered = inquirys;

    if (tabIndex === 0) {
      filtered = filtered.filter((inquiry) => inquiry.status === "pending");
    } else if (tabIndex === 1) {
      filtered = filtered.filter((inquiry) => inquiry.status === "approved");
    } else if (tabIndex === 2) {
      filtered = filtered.filter((inquiry) => inquiry.status === "rejected");
    }

    if (businessTypeFilter) {
      filtered = filtered.filter(
        (inquiry) => inquiry.business_type === businessTypeFilter
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (inquiry) =>
          new Date(inquiry.created_at).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      );
    }

    if (sortDate === "asc") {
      filtered = filtered.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (sortDate === "desc") {
      filtered = filtered.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    setFilteredInquiries(filtered);
  };

  useEffect(() => {
    filterInquiries();
    console.log(tabIndex);
  }, [tabIndex, businessTypeFilter, sortDate, selectedDate, inquirys]);

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Error",
        description: "Please enter a rejection reason!",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRejecting(true);
      await providerAPI.rejectEnquiry(selectedInquiry.enquiry_id, {
        reason: rejectReason,
      });
      const updatedInquiries = inquirys.map((item) =>
        item.enquiry_id === selectedInquiry.enquiry_id
          ? { ...item, status: "rejected" }
          : item
      );
      setInqirys(updatedInquiries);
      closeRejectModal();
      toast({
        title: "Success!",
        description: "Inquiry rejected successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error rejecting inquiry", error);
      toast({
        title: "Error",
        description: "Failed to reject inquiry!",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4 mt-4">
        <Tabs value={tabIndex} onValueChange={setTabIndex}>
          <TabsList>
            <TabsTrigger value={0}>Pending</TabsTrigger>
            <TabsTrigger value={1}>Approved</TabsTrigger>
            <TabsTrigger value={2}>Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Filters */}
        <div className="flex gap-4">
          <div>
            <select
              value={businessTypeFilter}
              onChange={(e) => setBusinessTypeFilter(e.target.value)}
              label="Business Type"
              className="p-2.5 border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="individual">Individual Providers</option>
              <option value="business">Business Providers</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <Button
            onClick={() => setSortDate(sortDate === "asc" ? "desc" : "asc")}
            variant="outline"
          >
            Sort by Date {sortDate === "asc" ? "+" : "-"}
          </Button>
        </div>
      </div>
      <Card className="w-full mt-10">
        <CardContent>
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.enquiry_id}>
                  <TableCell>{inquiry.User.name}</TableCell>
                  <TableCell>{inquiry.User.role}</TableCell>
                  <TableCell>{inquiry.business_type}</TableCell>
                  <TableCell>
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full 
              ${
                inquiry.status === "approved"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
                    >
                      {inquiry.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <>
                        {inquiry.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              onClick={() => handleOpenModal(inquiry)}
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => openConfirmModal(inquiry)}
                              variant="outline"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => openRejectModal(inquiry)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {inquiry.status === "approved" && (
                          <>
                            <Button
                              variant="default"
                              onClick={() => handleOpenModal(inquiry)}
                            >
                              View Details
                            </Button>
                          </>
                        )}
                      </>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Confirm Modal */}
        <Modal
          isOpen={confirmModalOpen}
          onRequestClose={closeConfirmModal}
          ariaHideApp={false}
          className="m-10 bg-white p-8 rounded-lg shadow-xl w-96 max-w-lg"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
        >
          <div className="space-y-4">
            <p>Are you sure you want to approve this inquiry?</p>
            <div className="flex space-x-4">
              <Button
                className="flex-1"
                onClick={handleApprove}
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
        </Modal>

        {/* Modal */}
        <Modal
          isOpen={isOpen}
          onRequestClose={handleCloseModal}
          ariaHideApp={false}
          contentLabel="Service Description"
          className="m-10 bg-white p-16 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out w-3/4 max-w-3xl max-h-[80vh] overflow-y-auto flex flex-col items-center"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
        >
          <InquiryPopup inquiry={selectedInquiry} />
        </Modal>

        {/* Reject Modal */}
        <Modal
          isOpen={rejectModalOpen}
          onRequestClose={closeRejectModal}
          ariaHideApp={false}
          className="m-10 bg-white p-8 rounded-lg shadow-xl w-96 max-w-lg"
          overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
        >
          <div className="space-y-4">
            <p>Enter a reason for rejecting this inquiry:</p>

            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex space-x-4">
              <Button
                className="flex-1"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "Confirm"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={closeRejectModal}
                disabled={isRejecting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default InquiryManager;
