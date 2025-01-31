"use client";
import { cartService } from "@api/cartService";
import {
  ArrowBackIosNewSharp,
  ArrowForwardIosSharp,
} from "@node_modules/@mui/icons-material";
import { Card, CardHeader, CardImage, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "@node_modules/next/image";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [bookingData, setBookingData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState();
  const [selectedStatus, setSelectedStatus] = useState("payment_pending");
  const statuses = [
    { label: "New Booking", color: "text-red-500", value: "cart" },

    {
      label: "Accepted Booking",
      color: "text-green-100",
      value: "payment_pending",
    },
    {
      label: "Accepted Booking",
      color: "text-green-500",
      value: "confirmed",
    },
    {
      label: "Service In-Progress",
      color: "text-orange-500",
      value: "in_progress",
    },
    { label: "Service Completed", color: "text-green-700", value: "completed" },
  ];

  const router = useRouter();

  const getStatusIndex = (status) =>
    statuses.findIndex((s) => s.value === status);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await cartService.getCustomerBooking();
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      {!selectedBooking ? (
        <>
          <aside className="w-80 md:w-1/4 bg-white p-4 border-r">
            <p
              className="flex items-center gap-2 text-3xl"
              onClick={() => router.back()}
            >
              <ArrowBackIosNewSharp style={{ fontSize: "1.5rem" }} />
              <span>Bookings</span>
            </p>

            <div className="rounded-lg border px-5 pb-8 mt-20">
              {[
                { n: "Pending", v: "payment_pending" },
                { n: "Confirmed", v: "confirmed" },
                { n: "Assigned", v: "assigned" },
                { n: "In Progress", v: "in_progress" },
                { n: "Completed", v: "completed" },
                { n: "Cancelled", v: "cancelled" },
                { n: "Refunded", v: "refunded" },
              ].map((status) => (
                <button
                  key={status.v}
                  className="w-full bg-indigo-500 text-white py-2 mt-8 rounded"
                  onClick={() => setSelectedStatus(status.v)}
                >
                  {status.n}{" "}
                  <ArrowForwardIosSharp
                    style={{ fontSize: "1rem", marginLeft: "10px" }}
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4">
            {filteredBookings.length > 0 ? (
              <div className="space-y-4 mx-20">
                {filteredBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="rounded-lg border mb-4">
                      <CardImage
                        src={
                          process.env.NEXT_PUBLIC_API_ENDPOINT +
                            booking?.BookingItems[0].serviceItem.icon_url ||
                          process.env.NEXT_PUBLIC_API_ENDPOINT +
                            booking?.BookingItems[0].packageItem.icon_url
                        }
                        crossOrigin="anonymous"
                        style={{
                          height: "150px",
                          objectFit: "cover",
                          width: "100%",
                        }}
                        alt="card_image"
                      />
                    </div>
                    <div className="flex justify-between px-2">
                      <div>
                        {booking?.BookingItems.map((item, index) => (
                          <h3 key={index} className="text-lg font-semibold">
                            {item?.packageItem?.name || item?.serviceItem?.name}
                          </h3>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="mb-3">{booking.booking_id}</p>
                        <p className="text-gray-600">
                          Rs. {booking?.BookingPayment?.total_amount}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-5 rounded-lg px-10 mt-5">
                      <div className="flex justify-between">
                        <p className="text-gray-600">Date</p>
                        <p className="text-gray-600">{booking.booking_date}</p>
                      </div>
                      <hr />
                      <div className="flex justify-between mt-5">
                        <p className="text-gray-600">Start Time</p>
                        <p className="text-gray-600">{booking.start_time}</p>
                      </div>
                      <hr />
                      <div className="flex justify-between mt-5">
                        <p className="text-gray-600">Payment Status</p>
                        <p className="text-gray-600">
                          {booking?.BookingPayment?.payment_status}
                        </p>
                      </div>
                      <hr />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>Loading</>
            )}
          </main>
        </>
      ) : (
        <>
          <div className="flex gap-10">
            {/* Booking Details */}

            <div className="w-full bg-white p-4 border-r">
              <p
                className="flex items-center gap-2 text-3xl"
                onClick={() => setSelectedBooking(null)}
              >
                <ArrowBackIosNewSharp style={{ fontSize: "1.5rem" }} />
                <span>Completed</span>
              </p>

              <div className="border rounded-lg p-5 mt-10">
                <p className="text-sm text-gray-500 mb-3 flex justify-between">
                  Booking ID{" "}
                  <span className="text-blue-500">
                    {selectedBooking?.booking_id}
                  </span>
                </p>
                <hr />
                <div className="mt-5">
                  {selectedBooking?.BookingItems.map((item, index) => (
                    <h3 key={index} className="text-lg font-semibold">
                      {item?.packageItem?.name || item?.serviceItem?.name}
                    </h3>
                  ))}
                </div>

                <p className="text-sm text-gray-600">
                  Date:{" "}
                  <span className="font-medium">
                    {selectedBooking?.booking_date}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Time:{" "}
                  <span className="font-medium">
                    {selectedBooking?.start_time}
                  </span>
                </p>

                <div className="mt-3">
                  <p className="text-sm font-semibold mb-2">Duration</p>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Service time taken:{" "}
                      {selectedBooking?.end_time &&
                        selectedBooking?.start_time &&
                        (
                          (selectedBooking.end_time -
                            selectedBooking.start_time) /
                          (1000 * 60)
                        ).toFixed(0) + " minutes"}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-semibold mb-2">Price Detail</p>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Price: ₹150 × 2 = ₹300
                    </p>
                    <p className="text-sm text-green-600">
                      Discount (5% off): - ₹15
                    </p>
                    <p className="text-sm text-gray-600">Tip (Online): ₹20</p>
                    <p className="text-sm text-gray-600">Coupon: None</p>
                    <p className="text-lg font-bold text-blue-600">
                      Total Amount: ₹305
                    </p>
                  </div>
                </div>

                <div className="mt-10 ">
                  <p className="text-sm font-semibold mb-2 ">
                    About Service Provider
                  </p>
                  <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                    <Image
                      src="/assets/images/def_pro.webp"
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt="Profile"
                    />
                    <div>
                      <p className="text-sm font-semibold">Abishek Kumar</p>
                      <p className="text-xs text-gray-600">
                        Tech Repair Expert
                      </p>
                      <p className="text-yellow-500">★★★★★ 4.5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Timeline and Review */}
            <div className="w-full mt-10">
              <div className="border rounded-lg">
                <Image
                  src="/service-image.png"
                  width={500}
                  height={250}
                  className="rounded-lg"
                  alt="Service"
                />
              </div>
              <div className="mt-4 border-l-4 border-gray-300 pl-4 space-y-3">
                <div className="mt-4 border-l-4 border-gray-300 pl-4 space-y-3">
                  {statuses.map((status, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {/* Display dot for each step */}
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index <= getStatusIndex(selectedBooking?.status)
                            ? "bg-indigo-500"
                            : "bg-gray-300"
                        }`}
                      ></div>

                      {/* Status text */}
                      <p
                        className={`${status.color} ${
                          index <= getStatusIndex(selectedBooking?.status)
                            ? "font-bold"
                            : "opacity-50"
                        }`}
                      >
                        {status.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Review */}
              <div className="mt-4 p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/images/def_pro.webp"
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="User"
                  />
                  <div>
                    <p className="text-sm font-semibold">John Doe (You)</p>
                    <p className="text-xs text-gray-500">02 Dec, 2024</p>
                    <p className="text-yellow-500">★★★★★ 4.5</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                  amet met
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
