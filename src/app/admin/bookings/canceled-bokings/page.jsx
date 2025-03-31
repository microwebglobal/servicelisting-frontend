"use client";
import { adminBookingService } from "@/api/adminBookingService";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Button } from "@components/ui/button";
import { toast } from "@hooks/use-toast";

const penaltyStatuses = [
  "no_penalty",
  "pending",
  "fully_settled_advance",
  "partially_settled_advance",
  "apply_next_booking",
  "completed",
];

const Page = () => {
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchCancelledBookings();
  }, []);

  const fetchCancelledBookings = async () => {
    try {
      const bookings =
        await adminBookingService.getCancelledBookingsByCustomer();
      setCancelledBookings(bookings);
    } catch (error) {
      console.error("Error fetching cancelled bookings:", error);
    }
  };

  const toggleExpandBooking = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const handleOpenDialog = (booking, type) => {
    setSelectedBooking(booking);
    setSelectedType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setSelectedType("");
  };

  const handleConfirmPenalty = async () => {
    try {
      if (!selectedBooking) return;

      const reqBody = {
        bookingId: selectedBooking.booking_id,
        type: selectedType,
        penaltyAmount: selectedBooking.penalty_amount,
      };

      await adminBookingService.handleCancelledBookingPanalty(reqBody);

      fetchCancelledBookings();
      handleCloseDialog();
      toast({
        title: "Success!",
        description: `Penalty Handled successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while processing the request.",
        variant: "destructive",
      });
    }
  };

  // Filter bookings based on penalty status
  const filteredBookings = filterStatus
    ? cancelledBookings.filter(
        (booking) => booking.penalty_status === filterStatus
      )
    : cancelledBookings;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cancelled Bookings</h1>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Penalty Status:</label>
        <select
          className="border rounded-md p-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          {penaltyStatuses.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white rounded-lg shadow-lg p-5 transition-all hover:shadow-xl cursor-pointer"
            >
              <div
                onClick={() => toggleExpandBooking(booking.booking_id)}
                className="flex justify-between items-center text-lg font-semibold"
              >
                <span>Booking ID: {booking.booking_id}</span>
                <div className="flex flex-col">
                  <span>Booking Status: {booking.status}</span>
                  <span>Penalty Status: {booking.penalty_status}</span>
                </div>
              </div>
              <div className="mt-2 text-gray-500">
                <p>Total Amount: ₹{booking.BookingPayment.total_amount}</p>
                <p>Penalty Amount: ₹{booking.penalty_amount}</p>
                <p>
                  Advance Payment: ₹{booking.BookingPayment.advance_payment}
                </p>
              </div>

              {/* Expanded Booking Details */}
              {booking.penalty_status === "pending" &&
                expandedBooking === booking.booking_id && (
                  <div className="mt-4 space-y-2 text-gray-700">
                    <p>Cancellation Reason: {booking.cancellation_reason}</p>
                    <p>Cancelled By: {booking.user_id}</p>
                    <p>
                      Cancellation Time:{" "}
                      {new Date(booking.cancellation_time).toLocaleString()}
                    </p>

                    {/* Payment Status Actions */}
                    {booking.BookingPayment.payment_status ===
                      "advance_only_paid" && (
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                        onClick={() => handleOpenDialog(booking, "advance")}
                      >
                        Settle With Advance
                      </button>
                    )}
                    {booking.BookingPayment.payment_status === "completed" && (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        onClick={() => handleOpenDialog(booking, "full")}
                      >
                        Settle With Paid Amount
                      </button>
                    )}
                    {booking.BookingPayment.payment_status === "pending" && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => handleOpenDialog(booking, "next")}
                      >
                        Settle In Next Booking
                      </button>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No cancelled bookings found.</p>
      )}

      {/* Dialog for Confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Penalty Settlement</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <p>
              Are you sure you want to settle the penalty of ₹
              {selectedBooking.penalty_amount} using {selectedType}:{" "}
              {selectedBooking.BookingPayment.advance_payment} ?
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="destractive">
            Cancel
          </Button>
          <Button onClick={handleConfirmPenalty}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
