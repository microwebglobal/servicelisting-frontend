"use client";
import { cartService } from "@api/cartService";
import { ArrowBackIosNewSharp } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import BookingStatus from "@components/booking/BookingStatus";
import BookingCard from "@components/booking/BookingCard";
import BookingDetails from "@components/booking/BookingDetails";
import BookingTimeline from "@components/booking/BookingTimeline";

const Page = () => {
  const [bookingData, setBookingData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("payment_pending");
  const router = useRouter();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await cartService.getCustomerBookings();
        setBookingData(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, []);

  const filteredBookings = selectedStatus
    ? bookingData.filter((booking) => booking.status === selectedStatus)
    : bookingData;

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedBooking ? (
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white p-6 border-r min-h-screen">
            <button
              className="flex items-center gap-2 text-2xl font-semibold hover:text-indigo-600 transition-colors"
              onClick={() => router.back()}
            >
              <ArrowBackIosNewSharp className="w-6 h-6" />
              <span>Bookings</span>
            </button>

            <BookingStatus onStatusChange={setSelectedStatus} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 md:p-8">
            {filteredBookings.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {filteredBookings.map((booking, index) => (
                  <BookingCard
                    key={booking.booking_id || index}
                    booking={booking}
                    onClick={() => setSelectedBooking(booking)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-600">
                    Loading bookings...
                  </p>
                  <p className="text-gray-500 mt-2">
                    Please wait while we fetch your booking data
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        // Booking Details View
        <div className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <button
              className="flex items-center gap-2 text-2xl font-semibold hover:text-indigo-600 transition-colors mb-6"
              onClick={() => setSelectedBooking(null)}
            >
              <ArrowBackIosNewSharp className="w-6 h-6" />
              <span>Back to Bookings</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Booking Details */}
              <div>
                <BookingDetails booking={selectedBooking} />
              </div>

              {/* Right Column - Timeline and Review */}
              <div>
                <BookingTimeline currentStatus={selectedBooking.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
