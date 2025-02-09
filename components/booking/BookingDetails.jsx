"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  formatCurrency,
  calculateDuration,
  formatDate,
  formatTime,
  getBookingStatusColor,
} from "../../utils/bookingUtils";

const BookingDetails = ({ booking }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!booking) return null;
  
  const payment = booking.BookingPayment || {};

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm space-y-6">
      {/* Booking Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <p className="text-sm text-gray-500">Booking ID</p>
          <p className="font-medium text-indigo-600">{booking.booking_id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Status</p>
          <p
            className={`font-medium capitalize ${getBookingStatusColor(
              booking.status
            )}`}
          >
            {booking.status?.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Service Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Service Details
        </h3>
        <div className="space-y-4">
          {booking.BookingItems?.map((item, index) => {
            const serviceDetails = item.serviceItem || item.packageItem;
            return (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    {serviceDetails?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-indigo-600">
                    {formatCurrency(item.total_price)}
                  </p>
                  {item.special_price && (
                    <p className="text-sm text-green-500">
                      Special Price Applied
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <p className="text-gray-600">Date</p>
            <p className="font-medium">{formatDate(booking.booking_date)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Start Time</p>
            <p className="font-medium">{formatTime(booking.start_time)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Duration</p>
            <p className="font-medium">
              {calculateDuration(booking.start_time, booking.end_time)}
            </p>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Service Location
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-800">{booking.service_address}</p>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Payment Details
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium">
              {formatCurrency(payment.subtotal || 0)}
            </p>
          </div>
          {payment.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <p>Discount</p>
              <p>- {formatCurrency(payment.discount_amount)}</p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (18%)</p>
            <p className="font-medium">
              {formatCurrency(payment.tax_amount || 0)}
            </p>
          </div>
          {payment.tip_amount > 0 && (
            <div className="flex justify-between">
              <p className="text-gray-600">Tip</p>
              <p className="font-medium">
                {formatCurrency(payment.tip_amount)}
              </p>
            </div>
          )}
          <hr className="border-gray-200 my-2" />
          <div className="flex justify-between text-lg font-bold">
            <p className="text-gray-800">Total</p>
            <p className="text-indigo-600">
              {formatCurrency(payment.total_amount || 0)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Payment Status:{" "}
            <span className="capitalize">{payment.payment_status}</span>
          </p>
        </div>
      </div>

      {/* Provider Details */}
      {booking.provider && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Service Provider
          </h3>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <Image
              src={
                booking.provider.profile_image || "/assets/images/def_pro.webp"
              }
              width={48}
              height={48}
              className="rounded-full"
              alt="Provider Profile"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {booking?.provider?.business_name ||
                  booking?.provider?.User?.name}
              </p>
              <p className="text-sm text-gray-600">
                {booking.provider.business_registration_number}
              </p>
              {booking.provider.rating && (
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {booking.provider.rating}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Expand Button */}
          <button
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less ▲" : "Show More ▼"}
          </button>

          {/* Expanded Section */}
          {expanded && (
            <div className="mt-3 bg-gray-100 p-4 rounded-lg transition-all duration-300">
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {booking.provider.User?.email}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Mobile:</strong> {booking.provider.User?.mobile}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Address:</strong> {booking.provider.address}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Service Category:</strong> {booking.provider.category}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Customer Notes */}
      {booking.customer_notes && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Notes
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800">{booking.customer_notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;