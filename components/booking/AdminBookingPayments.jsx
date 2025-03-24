"use client";
import { adminBookingService } from "@/api/adminBookingService";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const AdminBookingPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [expandedBookings, setExpandedBookings] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    const grouped = transactions.reduce((acc, transaction) => {
      const bookingId = transaction.booking_id;
      if (!acc[bookingId]) {
        acc[bookingId] = {
          transactions: [],
          total: 0,
        };
      }
      acc[bookingId].transactions.push(transaction);
      acc[bookingId].total += parseFloat(transaction.total_amount);
      return acc;
    }, {});

    setGroupedTransactions(grouped);
  }, [transactions]);

  const fetchAllTransactions = async () => {
    try {
      const transactions = await adminBookingService.getBookingTransactions();
      setTransactions(transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleBooking = (bookingId) => {
    setExpandedBookings((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  const filteredTransactions = Object.entries(groupedTransactions).filter(
    ([bookingId, data]) => {
      const matchesSearch = bookingId
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesDateRange = data.transactions.some((transaction) => {
        const transactionDate = new Date(transaction.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && transactionDate < start) return false;
        if (end && transactionDate > end) return false;
        return true;
      });

      return matchesSearch && matchesDateRange;
    }
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transaction Logs</h1>

      {/* Search and Filter Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Booking ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-64"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded-md"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded-md"
        />
      </div>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map(([bookingId, data]) => (
          <div
            key={bookingId}
            className="border border-gray-300 bg-white p-4 rounded-md shadow-md mb-6"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleBooking(bookingId)}
            >
              <h2 className="text-xl font-bold">
                Booking ID: {bookingId} (Total: ${data.total.toFixed(2)})
              </h2>
              {expandedBookings[bookingId] ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>

            {expandedBookings[bookingId] && (
              <div className="mt-4">
                {data.transactions.map((transaction) => (
                  <div
                    key={transaction.payment_id}
                    className="border-b last:border-none pb-4 mb-4"
                  >
                    <p>
                      <strong>Payment ID:</strong> {transaction.payment_id}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> ${transaction.subtotal}
                    </p>
                    <p>
                      <strong>Tip Amount:</strong> ${transaction.tip_amount}
                    </p>
                    <p>
                      <strong>Tax:</strong> ${transaction.tax_amount}
                    </p>
                    <p>
                      <strong>Discount:</strong> -${transaction.discount_amount}
                    </p>
                    <p className="text-lg font-bold">
                      <strong>Total Amount:</strong> ${transaction.total_amount}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded ${
                          transaction.payment_status === "completed"
                            ? "bg-green-200 text-green-800"
                            : transaction.payment_status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {transaction.payment_status}
                      </span>
                    </p>
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {transaction.payment_method}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No transactions found.</p>
      )}
    </div>
  );
};

export default AdminBookingPayments;
