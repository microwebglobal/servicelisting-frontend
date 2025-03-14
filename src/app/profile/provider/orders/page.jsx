"use client";
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

import {
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  UserCheck,
} from "lucide-react";
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from "react-big-calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { providerAPI } from "@/api/provider";
import { Button } from "@/components/ui/button";
import BookingStartModal from "@/components/business-employee/BookingStartModal";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import ProviderBookingEditModel from "@/components/business-employee/ProviderBookingEditModel";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = differenceInSeconds(targetDate, now);

      if (difference > 0) {
        return {
          days: Math.floor(difference / (3600 * 24)),
          hours: Math.floor((difference % (3600 * 24)) / 3600),
          minutes: Math.floor((difference % 3600) / 60),
          seconds: Math.floor(difference % 60),
        };
      }
      return null;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <div>Service time arrived!</div>;

  return (
    <div className="flex gap-2 items-center">
      {timeLeft.days > 0 && <Badge variant="outline">{timeLeft.days}d</Badge>}
      <Badge variant="outline">{timeLeft.hours}h</Badge>
      <Badge variant="outline">{timeLeft.minutes}m</Badge>
      <Badge variant="outline">{timeLeft.seconds}s</Badge>
    </div>
  );
};

const Timer = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(now, startTime);
      setElapsedTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return <span>{formatTime(elapsedTime)}</span>;
};

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
                {booking?.booking_date
                  ? format(new Date(booking.booking_date), "PPP")
                  : "No Date Available"}
              </p>
              <p>
                <span className="font-medium">Start Time:</span>{" "}
                {booking?.start_time
                  ? format(
                      new Date(`2000-01-01T${booking.start_time}`),
                      "hh:mm a"
                    )
                  : "No Date Available"}
              </p>
              <p>
                <span className="font-medium">End Time:</span>{" "}
                {booking?.end_time
                  ? format(
                      new Date(`2000-01-01T${booking.end_time}`),
                      "hh:mm a"
                    )
                  : "No Date Available"}
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

        {booking?.employee && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Assigned Employee
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Id:</span>{" "}
                {booking.employee?.employee_id}
              </p>
              <p>
                <span className="font-medium">Name:</span>{" "}
                {booking.employee?.User?.name}
              </p>
              <p>
                <span className="font-medium">Mobile:</span>{" "}
                {booking.employee?.User?.mobile}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {booking.employee?.User?.email}
              </p>
            </div>
          </Card>
        )}

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

const Page = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [user, setUser] = useState();
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [acceptedBookings, setAcceptedBookings] = useState(null);
  const [bookingRequests, setBookingRequests] = useState();
  const [bookingDates, setBookingDates] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);
  const [isStartModalOpen, setStartModalOpen] = useState(false);
  const [selectedBookingForStart, setSelectedBookingForStart] = useState(null);
  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [isBookingEdit, setIsBookingEdit] = useState(false);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        setUser(user);

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
          const formattedBookings = response.data.map((booking) => ({
            id: booking.booking_id,
            title: booking.booking_id,
            start: new Date(`${booking.booking_date}T${booking.start_time}`),
            end: new Date(`${booking.booking_date}T${booking.end_time}`),
            details: booking,
          }));
          const requestBookings = response.data.filter(
            (booking) => booking.status === "assigned"
          );
          setBookingDates(formattedBookings);

          const acceptBookings = response.data.filter(
            (booking) => booking.status === "accepted"
          );

          const ongingBookings = response.data.filter(
            (booking) => booking.status === "in_progress"
          );

          setOngoingBookings(ongingBookings);
          setAcceptedBookings(acceptBookings);
          setBookingRequests(requestBookings);
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
  }, [providerId, showEmployeeModal, showConfirmationModal]);

  useEffect(() => {
    if (bookings.length > 0) {
      const now = new Date();
      const upcoming = bookings
        .filter((b) => new Date(`${b.booking_date}T${b.start_time}`) > now)
        .sort(
          (a, b) =>
            new Date(`${a.booking_date}T${a.start_time}`) -
            new Date(`${b.booking_date}T${b.start_time}`)
        );

      console.log("upcoming:", upcoming, bookings);

      setLatestBooking(upcoming[0] || null);
    }
  }, [bookings]);

  const filteredBookings = bookings.filter((booking) => {
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
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  const handleOrderAcceptence = async (booking) => {
    try {
      setSelectedBooking(booking);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error("Error handling booking acceptance:", error);
    }
  };

  const handleConfirmation = async () => {
    try {
      if (user.role === "business_service_provider") {
        const employeesResponse = await providerAPI.getAvailableEmployees(
          providerId,
          selectedBooking.booking_id,
          selectedBooking.booking_date,
          selectedBooking.start_time,
          selectedBooking.end_time
        );

        setAvailableEmployees(employeesResponse.data.availableEmployees);
        setCurrentBookingId(selectedBooking.booking_id);
        setShowEmployeeModal(true);
      } else {
        await providerAPI.acceptProviderBookings(selectedBooking.booking_id);
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
    setShowConfirmationModal(false);
  };

  const formatBookingTime = (date) => {
    return format(date, "MMM dd, yyyy - hh:mm a");
  };

  const handleEmployeeConfirmation = async () => {
    try {
      if (!selectedEmployee) {
        alert("Please select an employee");
        return;
      }

      await providerAPI.acceptProviderBookings(currentBookingId, {
        employee_id: selectedEmployee,
      });

      setShowEmployeeModal(false);
      setSelectedEmployee(null);
      setCurrentBookingId(null);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const handleStartBooking = async (booking) => {
    console.log(booking);
    try {
      await providerAPI.sendBookingStartOtp({
        bookingId: booking.booking_id,
        mobile: booking?.customer?.mobile,
      });
      setSelectedBookingForStart(booking);
      setStartModalOpen(true);
    } catch (error) {
      console.error("Error Sending Otp", error);
    }
  };

  const handleConfirmStart = (booking) => {
    setOngoingBookings((prev) => [
      ...prev,
      { ...booking, startTime: new Date() },
    ]);
  };

  const ConfirmationModal = () => (
    <Dialog
      open={showConfirmationModal}
      onOpenChange={setShowConfirmationModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Booking Acceptance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to accept this booking?</p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmation}>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EmployeeSelectionModal = () => (
    <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Employee</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {availableEmployees.length > 0 ? (
            <RadioGroup
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
            >
              {availableEmployees.map((employee) => (
                <div
                  key={employee.employee_id}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={employee.employee_id}
                    id={employee.employee_id}
                  />
                  <Label htmlFor={employee.employee_id}>
                    {employee.User.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-gray-500">No active employees available.</p>
          )}
        </div>

        <Button
          onClick={handleEmployeeConfirmation}
          disabled={!selectedEmployee || availableEmployees.length === 0}
        >
          Confirm Assignment
        </Button>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-[300px,300px,1fr] gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Recent Order Requests</h3>
            <div>
              {bookingRequests.map((booking) => (
                <div
                  key={booking.booking_id}
                  className="p-2 border last:border-b-0"
                >
                  <p
                    onClick={() => {
                      setSelectedBooking(booking);
                      setDialogOpen(true);
                    }}
                    className="font-medium"
                  >
                    Booking #{booking.booking_id}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {booking.customer?.name} - {booking.status}
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => handleOrderAcceptence(booking)}>
                      Accept
                    </Button>
                    <Button variant="destructive">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Ongoing Bookings
          </h2>
          <Card className="p-4">
            <div className="space-y-4">
              {ongoingBookings.length > 0 ? (
                ongoingBookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="border-b pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Booking #{booking.booking_id}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Timer startTime={booking.start_time} />
                        </p>
                      </div>
                      <Button className="bg-red-500 text-white">Stop</Button>
                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => setIsBookingEdit(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No ongoing bookings
                </p>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          {latestBooking && (
            <Card className="mb-6 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-3">Next Booking</h3>
                  <p>Booking #{latestBooking.booking_id}</p>
                  {user.role != "business_service_provider" && (
                    <Button
                      className="bg-green-300 text-black mt-2"
                      onClick={() => handleStartBooking(latestBooking)}
                    >
                      Start
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <CountdownTimer
                    targetDate={
                      new Date(
                        `${latestBooking.booking_date}T${latestBooking.start_time}`
                      )
                    }
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {formatBookingTime(
                      new Date(
                        `${latestBooking.booking_date}T${latestBooking.start_time}`
                      )
                    )}
                  </p>
                </div>
              </div>
            </Card>
          )}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Today's Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Bookings</span>
                <span className="font-medium">{filteredBookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-medium">
                  {
                    filteredBookings.filter((b) => b.status === "completed")
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium">
                  {
                    filteredBookings.filter((b) => b.status === "pending")
                      .length
                  }
                </span>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Accepted Orders</h3>
            <div>
              {acceptedBookings.map((booking) => (
                <div
                  key={booking.booking_id}
                  className="p-2 border last:border-b-0"
                >
                  <p
                    onClick={() => {
                      setSelectedBooking(booking);
                      setDialogOpen(true);
                    }}
                    className="font-medium"
                  >
                    Booking #{booking.booking_id}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {booking.customer?.name} - {booking.status}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, "PPPP")}
            </h2>
          </div>

          <Calendar
            localizer={localizer}
            events={bookingDates}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>

      <EmployeeSelectionModal />
      <ConfirmationModal />

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <BookingDetailsModal booking={selectedBooking} />
      </Dialog>
      <Dialog open={isBookingEdit} onOpenChange={setIsBookingEdit}>
        <ProviderBookingEditModel
          booking={ongoingBookings[0]}
          onClose={() => setIsBookingEdit(false)}
        />
      </Dialog>
      <Dialog open={isStartModalOpen} onOpenChange={setStartModalOpen}>
        <BookingStartModal
          booking={selectedBookingForStart}
          onConfirm={handleConfirmStart}
          onClose={() => setStartModalOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default Page;
