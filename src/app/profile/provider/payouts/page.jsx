"use client";
import { providerAPI } from "@/api/provider";
import { Warning } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { FaMoneyCheckAlt, FaCalendarDay, FaClock } from "react-icons/fa";

const Page = () => {
  const [dailyPayouts, setDailyPayouts] = useState([]);
  const [duePayouts, setDuePayouts] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalDuePayable, setTotalDuePayable] = useState(0);

  useEffect(() => {
    fetchDailyPayouts();
    fetchProviderDuePayouts();
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

  const fetchProviderDuePayouts = async () => {
    try {
      const response = await providerAPI.getProviderDuePayouts();
      setDuePayouts(response.data || []);
      setTotalDuePayable(parseFloat(response.data?.totalDuePayable || 0));
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Daily Payout Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
          <FaCalendarDay className="text-indigo-600" />
          Provider Daily Payouts
        </div>

        <div className="bg-gradient-to-r from-indigo-100 to-white border border-indigo-200 rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Today's Total:{" "}
            <span className="text-indigo-600">{dailyTotal.toFixed(2)}</span>
          </h3>
          {dailyTotal > 0 ? (
            <button
              className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
              onClick={() => handleSettlePayout(dailyTotal)}
              disabled={isProcessing}
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
          <p className="text-gray-600">No payouts found for today.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {dailyPayouts.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg text-indigo-700 mb-1">
                  Booking ID: {booking.booking_id}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Date:</strong> {booking.booking_date}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Total Payable:</strong> ${booking.totalPayable}
                </p>

                <div>
                  <h4 className="font-semibold text-gray-800">Items:</h4>
                  <ul className="list-disc list-inside text-gray-700 mb-2">
                    {booking.BookingItems?.map((item, index) => (
                      <li key={index}>
                        {item.item_name} - ${item.price}
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-gray-800">Payments:</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {booking.BookingPayments?.map((payment, index) => (
                      <li key={index}>
                        Method: {payment.payment_method} | Amount: $
                        {payment.total_amount}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Due Payout Section */}
      <section>
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
          <FaClock className="text-red-600" />
          Provider Due Payouts
        </div>

        <div className="bg-gradient-to-r from-red-100 to-white border border-red-200 rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Total Due Payable:{" "}
            <span
              className={`font-bold ${
                totalDuePayable < 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalDuePayable.toFixed(2)}
            </span>
          </h3>

          {totalDuePayable < 0 ? (
            <p className="mt-2 text-green-700 font-medium">
              This will be settled soon by Qproz.
            </p>
          ) : totalDuePayable > 0 ? (
            <>
              <button
                className="mt-3 bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => handleSettlePayout(totalDuePayable)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Settle Now"}
              </button>
              <p className="mt-2 text-sm text-red-700 font-semibold">
                <Warning /> If not settled within 24 hours, your account will be
                suspended.
              </p>
            </>
          ) : null}
        </div>

        {duePayouts?.bookings?.length === 0 ? (
          <p className="text-gray-600">No due payouts available.</p>
        ) : (
          <div className="space-y-6">
            {duePayouts?.bookings?.map((booking) => (
              <div
                key={booking.booking_id}
                className="border border-gray-300 rounded-lg p-5 shadow-md bg-white"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    Booking ID: {booking.booking_id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booking Date: {booking.booking_date}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Items</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {booking.items?.map((item, index) => (
                      <li key={index}>Item ID: {item.item_id}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Payments</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-600">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 font-medium">Method</th>
                          <th className="px-3 py-2 font-medium">Total</th>
                          <th className="px-3 py-2 font-medium">Advance</th>
                          <th className="px-3 py-2 font-medium">Commission</th>
                          <th className="px-3 py-2 font-medium">Tax</th>
                          <th className="px-3 py-2 font-medium">Payable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking.payments?.map((payment, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-3 py-2">
                              {payment.payment_method}
                            </td>
                            <td className="px-3 py-2">
                              ${payment.total_amount}
                            </td>
                            <td className="px-3 py-2">
                              ${payment.advance_payment}
                            </td>
                            <td className="px-3 py-2">
                              ${payment.service_commition}
                            </td>
                            <td className="px-3 py-2">${payment.tax_amount}</td>
                            <td className="px-3 py-2 font-semibold text-green-700">
                              ${payment.payable}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    Total Due: ${booking.totalPayable}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
