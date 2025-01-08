"use client";
import React, { useState, useEffect } from "react";
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

const InquiryManager = () => {
  const [inquirys, setInqirys] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = (inquiry) => {
    setIsOpen(true);
    setSelectedInquiry(inquiry);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchInquirys = async () => {
      try {
        const response = await providerAPI.getEnquiry();
        setInqirys(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("error fetching inquiries", error);
      }
    };

    fetchInquirys();
  }, []);
  return (
    <Card className="w-full mt-10">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Busines Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquirys.map((inquiry) => (
              <TableRow
                key={inquiry.enquiry_id}
                onClick={() => handleOpenModal(inquiry)}
              >
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
                inquiry.status === "Approved"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
                  >
                    {inquiry.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Approve</Button>
                    <Button variant="destructive">Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
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
    </Card>
  );
};

export default InquiryManager;
