"use client";
import { adminBookingService } from "@/api/adminBookingService";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [payoutLogs, setPayoutLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayoutLogsByDate(selectedDate);
  }, [selectedDate]);

  const fetchPayoutLogsByDate = async (date) => {
    try {
      const logs = await adminBookingService.getDailyPayoutLogs(date);
      setPayoutLogs(logs.paymentLogs || []);
    } catch (error) {
      console.error("Error fetching payout logs:", error);
      setPayoutLogs([]);
    }
  };

  const handleGenarateDailyReport = async () => {
    try {
      await adminBookingService.genarateDailyPayoutLogs(selectedDate);
      fetchPayoutLogsByDate(selectedDate);
    } catch (error) {}
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Daily Payout Logs</h1>

      {/* Date Picker */}
      <div className="flex justify-between">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <Button onClick={handleGenarateDailyReport}>Genarate</Button>
      </div>

      {/* Logs Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Log ID</th>
            <th className="border p-2">Provider ID</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {payoutLogs.length > 0 ? (
            payoutLogs.map((log) => (
              <tr key={log.log_id} className="border">
                <td className="border p-2">{log.log_id}</td>
                <td className="border p-2">{log.provider_id || "N/A"}</td>
                <td className="border p-2">{log.payout_amount}</td>
                <td className="border p-2">{log.payout_status}</td>
                <td className="border p-2">{log.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
