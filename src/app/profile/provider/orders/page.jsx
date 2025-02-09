'use client';
import React, { useEffect, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
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
import { Loader2, Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { providerAPI } from "@/api/provider";

const BookingDetailsModal = ({ booking }) => {
  if (!booking) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      assigned: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-blue-100 text-blue-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <DialogContent className="max-w-3xl">
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
              <p><span className="font-medium">Name:</span> {booking.customer?.name}</p>
              <p><span className="font-medium">Email:</span> {booking.customer?.email}</p>
              <p><span className="font-medium">Phone:</span> {booking.customer?.mobile}</p>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Service Schedule
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Date:</span> {format(new Date(booking.booking_date), 'PPP')}</p>
              <p><span className="font-medium">Time:</span> {format(new Date(`2000-01-01T${booking.start_time}`), 'hh:mm a')}</p>
              <p><span className="font-medium">Duration:</span> {
                (() => {
                  const start = new Date(`2000-01-01T${booking.start_time}`);
                  const end = new Date(`2000-01-01T${booking.end_time}`);
                  const diff = (end - start) / (1000 * 60);
                  return `${diff} minutes`;
                })()
              }</p>
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
            <p><span className="font-medium">City:</span> {booking.City?.name}</p>
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
                    <TableCell>{item.item_type.replace('_', ' ')}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">₹{parseFloat(item.total_price).toFixed(2)}</TableCell>
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
                <span>₹{parseFloat(booking.BookingPayment.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹{parseFloat(booking.BookingPayment.tax_amount).toFixed(2)}</span>
              </div>
              {parseFloat(booking.BookingPayment.tip_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tip</span>
                  <span>₹{parseFloat(booking.BookingPayment.tip_amount).toFixed(2)}</span>
                </div>
              )}
              {parseFloat(booking.BookingPayment.discount_amount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{parseFloat(booking.BookingPayment.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>₹{parseFloat(booking.BookingPayment.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 pt-2">
                <span>Payment Method</span>
                <span className="capitalize">{booking.BookingPayment.payment_method}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Payment Status</span>
                <Badge variant="outline" className={
                  booking.BookingPayment.payment_status === 'completed' 
                    ? 'text-green-600 border-green-200' 
                    : 'text-yellow-600 border-yellow-200'
                }>
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

const TimelineView = ({ bookings, onSelectBooking }) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getBookingsForHour = (hour) => {
    return bookings.filter(booking => {
      const bookingHour = parseInt(booking.start_time.split(':')[0]);
      return bookingHour === hour;
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      assigned: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      completed: "bg-green-50 border-green-200 hover:bg-green-100",
      cancelled: "bg-red-50 border-red-200 hover:bg-red-100",
      pending: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    };
    return statusColors[status] || "bg-gray-50 border-gray-200 hover:bg-gray-100";
  };

  return (
    <div className="border rounded-lg divide-y">
      {hours.map(hour => (
        <div key={hour} className="flex items-start p-4">
          <div className="w-16 text-sm text-gray-500">
            {format(new Date().setHours(hour, 0), 'hh:mm a')}
          </div>
          <div className="flex-1 space-y-2">
            {getBookingsForHour(hour).map(booking => (
              <div
                key={booking.booking_id}
                onClick={() => onSelectBooking(booking)}
                className={`cursor-pointer p-3 rounded-lg border ${getStatusColor(booking.status)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{booking.customer?.name}</p>
                    <p className="text-sm text-gray-600">{booking.BookingItems[0]?.serviceItem?.name}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Page = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user?.uId) {
          setError("Please log in to view bookings");
          setLoading(false);
          return;
        }

        const response = await providerAPI.getProviderByUserId(user.uId);
        if (response.data && response.data.provider_id) {
          setProviderId(response.data.provider_id);
        } else {
          setError("Provider information not found");
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
        setError("Failed to load provider information");
        setLoading(false);
      }
    };

    fetchProviderId();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!providerId) return;

      try {
        const response = await providerAPI.getProviderBookings(providerId);
        if (Array.isArray(response.data)) {
          setBookings(response.data);
          setError(null);
        } else {
          setError("Invalid booking data received");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchBookings();
    }
  }, [providerId]);

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    return (
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date || new Date())}
              className="rounded-md"
            />
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Today's Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Bookings</span>
                <span className="font-medium">{filteredBookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-medium">{
                  filteredBookings.filter(b => b.status === 'completed').length
                }</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium">{
                  filteredBookings.filter(b => b.status === 'pending').length
                }</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, 'PPPP')}
            </h2>
          </div>

          <TimelineView 
            bookings={filteredBookings}
            onSelectBooking={(booking) => {
              setSelectedBooking(booking);
              setDialogOpen(true);
            }}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <BookingDetailsModal booking={selectedBooking} />
      </Dialog>
    </div>
  );
};

export default Page;