"use client";
import { providerAPI } from "@api/provider";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
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

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [ordersByHour, setOrdersByHour] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user?.uId) {
      const fetchServiceProviderOrders = async () => {
        try {
          const response = await providerAPI.getProviderBookings(1);
          setOrders(response.data);
        } catch (error) {
          console.error("An error occurred while fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchServiceProviderOrders();
    }
  }, []);

  // Function to group orders by hour
  const groupOrdersByHour = (orders) => {
    const newOrdersByHour = {};
    for (let i = 8; i <= 17; i++) {
      newOrdersByHour[i] = [];
    }

    orders.forEach((order) => {
      const hour = parseInt(order.start_time.split(":")[0], 10);
      if (newOrdersByHour[hour]) {
        newOrdersByHour[hour].push(order);
      }
    });

    return newOrdersByHour;
  };

  // Convert selectedDate to a UTC string format for filtering and update ordersByHour
  useEffect(() => {
    if (!loading) {
      const selectedDateString = selectedDate.toISOString().split("T")[0];

      const filteredOrders = orders.filter((order) => {
        const bookingDateUTC = order.booking_date.split("T")[0];
        return bookingDateUTC === selectedDateString;
      });

      console.log("Filtered Orders for Selected Date:", filteredOrders); // Debugging

      const newOrdersByHour = groupOrdersByHour(filteredOrders);
      setOrdersByHour(newOrdersByHour);
    }
  }, [selectedDate, orders, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Orders</h1>

      {/* Calendar View */}
      <div className=" p-6 mb-6">
        <div className="flex">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mt-4 w-full max-w-xs border rounded-lg shadow-md"
            />
          </div>

          <div className="container ml-10">
            <h2 className="text-2xl flex gap-3 font-semibold text-gray-800 mb-5 ml-10">
              <FaCalendarAlt /> Orders on {selectedDate.toDateString()}
            </h2>

            {/* Time Grid */}
            <div className="border-l-2 border-gray-300 relative ml-20 bg-gray-100 rounded-lg shadow-lg">
              {Object.keys(ordersByHour).map((hour) => (
                <div
                  key={hour}
                  className="relative pl-4 border-b border-gray-200 p-2"
                >
                  {/* Time Label */}
                  <div className="absolute left-0 -translate-x-full text-gray-500 text-sm w-12 text-right pr-2">
                    {hour}:00
                  </div>

                  {/* Orders at this time */}
                  {ordersByHour[hour].length > 0 ? (
                    <div className="space-y-2">
                      {ordersByHour[hour].map((order) => (
                        <div
                          key={order.booking_id}
                          className="bg-gray-500 text-white p-2 rounded-lg shadow-md"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDialogOpen(true);
                          }}
                        >
                          <h3 className="text-sm font-medium">
                            {order.booking_id}
                          </h3>
                          <p className="text-xs">Status: {order.status}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-10"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <BookingDetailsModal booking={selectedOrder} />
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
