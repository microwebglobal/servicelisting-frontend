"use client";
import { adminBookingService } from "@/api/adminBookingService";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/bookingUtils";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [payoutLogs, setPayoutLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchPayoutLogsByDate(selectedDate);
  }, [selectedDate, statusFilter]);

  const fetchPayoutLogsByDate = async (date) => {
    try {
      const logs = await adminBookingService.getDailyPayoutLogs(date);
      let filteredLogs = logs.paymentLogs || [];

      if (statusFilter !== "all") {
        filteredLogs = filteredLogs.filter(
          (log) => log.payout_status === statusFilter
        );
      }

      filteredLogs.sort((a, b) => b.log_id - a.log_id);

      setPayoutLogs(filteredLogs);
      setIsReportGenerated(filteredLogs.length > 0);
    } catch (error) {
      console.error("Error fetching payout logs:", error);
      setPayoutLogs([]);
      setIsReportGenerated(false);
    }
  };

  const handleGenerateDailyReport = async () => {
    try {
      await adminBookingService.genarateDailyPayoutLogs(selectedDate);
      fetchPayoutLogsByDate(selectedDate);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleSettleAmount = async () => {
    if (!selectedLog) return;

    try {
      await adminBookingService.settleDailyPayoutLogs(selectedLog.log_id, {
        amount: selectedLog.payout_amount,
        providerId: selectedLog.provider_id,
      });

      setIsModalOpen(false);
      fetchPayoutLogsByDate(selectedDate);
    } catch (error) {
      console.error("Error settling amount:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Daily Payout Logs
      </h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded shadow-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <Button
          onClick={handleGenerateDailyReport}
          disabled={isReportGenerated}
          className={isReportGenerated ? "opacity-50 cursor-not-allowed" : ""}
        >
          Generate Report
        </Button>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="border p-3">Log ID</th>
              <th className="border p-3">Provider ID</th>
              <th className="border p-3">Amount</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Date</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {payoutLogs.length > 0 ? (
              payoutLogs.map((log) => (
                <tr key={log.log_id} className="border hover:bg-gray-100">
                  <td className="border p-3">{log.log_id}</td>
                  <td className="border p-3">{log.provider_id || "N/A"}</td>
                  <td className="border p-3 text-green-600 font-semibold">
                    {formatCurrency(log.payout_amount)}
                  </td>
                  <td
                    className={`border p-3 font-medium ${
                      log.payout_status === "completed"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {log.payout_status}
                  </td>
                  <td className="border p-3">{log.date}</td>
                  <td className="border p-3 text-center">
                    {log.payout_status !== "completed" && (
                      <Button
                        className="text-white px-3 py-1 rounded"
                        onClick={() => {
                          setSelectedLog(log);
                          setIsModalOpen(true);
                        }}
                      >
                        Settle
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Settlement</h2>
            <p className="text-gray-700">
              Are you sure you want to settle this payout of{" "}
              <span className="font-bold text-green-600">
                ${selectedLog.payout_amount}
              </span>{" "}
              for provider{" "}
              <span className="font-bold">{selectedLog.provider_id}</span>?
            </p>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-gray-500 text-white px-4 py-2 mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white px-4 py-2"
                onClick={handleSettleAmount}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
