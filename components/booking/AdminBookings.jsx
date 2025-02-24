"use client";
import React, { useState, useEffect } from "react";
import { adminBookingService } from "../../api/adminBookingService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BookingDetailsModal = ({ booking }) => {
  if (!booking) return null;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Booking Details - {booking.booking_id}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Customer Details</h3>
            <p>Name: {booking.customer?.name}</p>
            <p>Email: {booking.customer?.email}</p>
            <p>Phone: {booking.customer?.mobile}</p>
          </div>
          <div>
            <h3 className="font-semibold">Service Details</h3>
            <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
            <p>Time: {booking.start_time}</p>
            <p>Status: {booking.status}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Booked Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booking.BookingItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.serviceItem?.name || item.packageItem?.name}
                  </TableCell>
                  <TableCell>{item.item_type}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.total_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="font-semibold">Payment Details</h3>
          <p>Subtotal: ${booking.BookingPayment?.subtotal}</p>
          <p>Tax: ${booking.BookingPayment?.tax_amount}</p>
          <p>Tip: ${booking.BookingPayment?.tip_amount}</p>
          <p>Total: ${booking.BookingPayment?.total_amount}</p>
          <p>Status: {booking.BookingPayment?.payment_status}</p>
        </div>
      </div>
    </DialogContent>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  });
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [filters, currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { bookings, totalPages } = await adminBookingService.getAllBookings(
        filters,
        currentPage
      );
      setBookings(bookings);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceProviders = async (cityId, categoryIds) => {
    try {
      const response = await adminBookingService.getServiceProviders(
        cityId,
        categoryIds
      );
      setServiceProviders(response);
      return response;
    } catch (error) {
      console.error("Error fetching service providers:", error);
      return [];
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminBookingService.updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleAssignProvider = async (bookingId, providerId) => {
    try {
      await adminBookingService.assignServiceProvider(bookingId, providerId);
      fetchBookings();
    } catch (error) {
      console.error("Error assigning provider:", error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await adminBookingService.updateBookingStatus(
        bookingToCancel,
        "cancelled",
        "Cancelled by admin"
      );
      fetchBookings();
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const openCancelDialog = (bookingId) => {
    setBookingToCancel(bookingId);
    setIsCancelDialogOpen(true);
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "payment_pending", label: "Payment Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const filteredProviders = (booking) =>
    serviceProviders.filter(
      (provider) =>
        (provider.User?.name || provider.business_name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        provider.provider_id !== booking?.provider?.provider_id
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bookings Management</CardTitle>
        <div className="flex gap-4">
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(value) =>
              setFilters({ ...filters, dateRange: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                  <TableCell>{booking.booking_id}</TableCell>
                  <TableCell>{booking.customer?.name}</TableCell>
                  <TableCell>
                    {new Date(booking.booking_date).toLocaleDateString()}{" "}
                    {booking.start_time}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(value) =>
                        handleStatusChange(booking.booking_id, value)
                      }
                      disabled={["cancelled", "refunded"].includes(
                        booking.status
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions
                          .filter(
                            (option) =>
                              option.value !== "all" &&
                              option.value !== "payment_pending"
                          )
                          .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {booking.status !== "cancelled" && (
                      <Select
                        onOpenChange={(open) => {
                          if (open) {
                            fetchServiceProviders(
                              booking?.City?.city_id,
                              booking?.BookingItems?.map(
                                (item) => item.category_id
                              ) || []
                            );
                          } else {
                            setSearchQuery(""); // Clear search query when dropdown closes
                          }
                        }}
                        value={
                          booking?.provider?.provider_id
                            ? booking.provider.provider_id.toString()
                            : "unassigned"
                        }
                        onValueChange={(value) =>
                          value !== "unassigned" &&
                          handleAssignProvider(booking.booking_id, value)
                        }
                        disabled={[
                          "cancelled",
                          "completed",
                          "refunded",
                        ].includes(booking.status)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <Input
                            placeholder="Search providers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-2"
                          />
                          {booking?.provider?.provider_id && (
                            <SelectItem
                              value={booking.provider.provider_id.toString()}
                            >
                              {booking.provider.User?.name ||
                                booking.provider.business_name}
                            </SelectItem>
                          )}
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {filteredProviders(booking).map((provider) => (
                            <SelectItem
                              key={provider.provider_id}
                              value={provider.provider_id.toString()}
                            >
                              {provider.User?.name || provider.business_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        Details
                      </Button>
                      {!["cancelled", "completed", "refunded"].includes(
                        booking.status
                      ) && (
                        <Button
                          variant="destructive"
                          onClick={() => openCancelDialog(booking.booking_id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex flex-col items-center justify-center">
          <div className="flex mt-4 gap-5">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white disabled:bg-gray-300"
            >
              Previous
            </Button>

            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white disabled:bg-gray-300"
            >
              Next
            </Button>
          </div>
          <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
        </div>

        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <BookingDetailsModal booking={selectedBooking} />
        </Dialog>

        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
            <Button onClick={() => setIsCancelDialogOpen(false)}>
              No, Go Back
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Yes, Cancel Booking
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminBookings;
