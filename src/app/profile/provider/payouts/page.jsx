"use client";
import { providerAPI } from "@/api/provider";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [dailyPayouts, setDailyPayouts] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDailyPayouts();
  }, []);

  const fetchDailyPayouts = async () => {
    try {
      const response = await providerAPI.getProviderDailyPayouts();
      setDailyPayouts(response.data.result || []);
      setDailyTotal(parseFloat(response.data.dailyTotal || 0));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSettlePayout = async (amount) => {
    if (!amount || isProcessing) return;

    try {
      setIsProcessing(true);
      const response = await providerAPI.processProviderDailyPayment({
        amount,
      });

      if (response.data.success && response.data.checkoutPageUrl) {
        window.open(response.data.checkoutPageUrl);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Provider Daily Payouts</h2>

      <div className="mb-6">
        <h3 className="text-xl font-medium">
          Total for Today: ${dailyTotal.toFixed(2)}
        </h3>
        {dailyTotal > 0 ? (
          <button
            className="mt-2 bg-black text-white px-4 py-2 rounded  disabled:opacity-50"
            onClick={() => handleSettlePayout(dailyTotal)}
            disabled={isProcessing || dailyTotal <= 0}
          >
            {isProcessing ? "Processing..." : "Settle Now"}
          </button>
        ) : (
          <p className="mt-2 text-green-600">
            You will receive this amount via Qproz within 24 hours.
          </p>
        )}
      </div>

      {dailyPayouts.length === 0 ? (
        <p>No payouts found for today.</p>
      ) : (
        <div className="grid gap-4">
          {dailyPayouts.map((booking) => (
            <div
              key={booking.booking_id}
              className="border rounded-lg p-4 shadow-md"
            >
              <h3 className="font-bold text-lg mb-2">
                Booking ID: {booking.booking_id}
              </h3>
              <p>
                <strong>Date:</strong> {booking.booking_date}
              </p>
              <p>
                <strong>Total Payable:</strong> ${booking.totalPayable}
              </p>

              <h4 className="font-semibold mt-3">Items:</h4>
              <ul className="list-disc list-inside">
                {booking.BookingItems?.map((item, index) => (
                  <li key={index}>
                    {item.item_name} - ${item.price}
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold mt-3">Payments:</h4>
              <ul className="list-disc list-inside">
                {booking.BookingPayments?.map((payment, index) => (
                  <li key={index}>
                    Method: {payment.payment_method} | Amount: $
                    {payment.total_amount}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
