"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { providerAPI } from "@api/provider";
import EmployeeSidebar from "@/components/business-employee/EmployeeSidebar";
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from "react-big-calendar";
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
import {
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

const BookingDetailsModal = ({ booking }) => {
  if (!booking) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      assigned: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <DialogContent className="max-w-3xl p-14">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Booking #{booking.booking_id}</span>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {booking.customer?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {booking.customer?.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {booking.customer?.mobile}
              </p>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Service Schedule
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {format(new Date(booking.booking_date), "PPP")}
              </p>
              <p>
                <span className="font-medium">Start Time:</span>{" "}
                {format(
                  new Date(`2000-01-01T${booking.start_time}`),
                  "hh:mm a"
                )}
              </p>
              <p>
                <span className="font-medium">End Time:</span>{" "}
                {format(new Date(`2000-01-01T${booking.end_time}`), "hh:mm a")}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {(() => {
                  const start = new Date(`2000-01-01T${booking.start_time}`);
                  const end = new Date(`2000-01-01T${booking.end_time}`);
                  const diff = (end - start) / (1000 * 60);
                  return `${diff} minutes`;
                })()}
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Service Location
          </h3>
          <div className="space-y-2 text-sm">
            <p>{booking.service_address}</p>
            <p>
              <span className="font-medium">City:</span> {booking.City?.name}
            </p>
            {booking.customer_notes && (
              <div className="mt-2">
                <p className="font-medium">Customer Notes:</p>
                <p className="text-gray-600">{booking.customer_notes}</p>
              </div>
            )}
          </div>
        </Card>

        {booking.BookingItems && booking.BookingItems.length > 0 && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Service Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booking.BookingItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.serviceItem?.name || item.packageItem?.name}
                    </TableCell>
                    <TableCell>{item.item_type.replace("_", " ")}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{parseFloat(item.total_price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {booking.BookingPayment && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  ₹{parseFloat(booking.BookingPayment.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>
                  ₹{parseFloat(booking.BookingPayment.tax_amount).toFixed(2)}
                </span>
              </div>
              {parseFloat(booking.BookingPayment.tip_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tip</span>
                  <span>
                    ₹{parseFloat(booking.BookingPayment.tip_amount).toFixed(2)}
                  </span>
                </div>
              )}
              {parseFloat(booking.BookingPayment.discount_amount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>
                    -₹
                    {parseFloat(booking.BookingPayment.discount_amount).toFixed(
                      2
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>
                  ₹{parseFloat(booking.BookingPayment.total_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 pt-2">
                <span>Payment Method</span>
                <span className="capitalize">
                  {booking.BookingPayment.payment_method}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Payment Status</span>
                <Badge
                  variant="outline"
                  className={
                    booking.BookingPayment.payment_status === "completed"
                      ? "text-green-600 border-green-200"
                      : "text-yellow-600 border-yellow-200"
                  }
                >
                  {booking.BookingPayment.payment_status}
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DialogContent>
  );
};

const BusinessEmployeeProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const localizer = momentLocalizer(moment);

  const router = useRouter();

  // Fetch Employee Data
  const fetchEmployeeData = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.uId) {
        router.push("/login/user");
        return;
      }

      const response = await providerAPI.getEmployeeByUserId();
      setProfileData(response.data);
      console.log("Employee Data:", response.data);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchBookings = useCallback(async (employeeId) => {
    try {
      const response = await providerAPI.getEmployeeBookings(employeeId);
      const formattedBookings = response.data.map((booking) => ({
        id: booking.booking_id,
        title: booking.booking_id,
        start: new Date(`${booking.booking_date}T${booking.start_time}`),
        end: new Date(`${booking.booking_date}T${booking.end_time}`),
        details: booking,
      }));
      setBookings(formattedBookings);
      console.log("Formatted Bookings Data:", formattedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  useEffect(() => {
    if (profileData?.employee_id) {
      fetchBookings(profileData.employee_id);
    }
  }, [profileData, fetchBookings]);

  const handleEventSelect = (event) => {
    setSelectedBooking(event.details);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <EmployeeSidebar profileData={profileData} />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Schedule
        </h2>
        <div className="flex">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <Calendar
              localizer={localizer}
              events={bookings}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={handleEventSelect}
            />
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <BookingDetailsModal booking={selectedBooking} />
      </Dialog>
    </div>
  );
};

export default BusinessEmployeeProfile;
