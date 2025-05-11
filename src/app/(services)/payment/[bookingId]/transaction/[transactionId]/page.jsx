"use client";
import { cartService } from "@/api/cartService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

const TransactionPage = ({ params }) => {
  const { bookingId, transactionId } = params;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text(`Transaction ID: ${transactionId}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 60);
    doc.text(`Status: ${status ? "Confirmed" : "Failed"}`, 20, 70);
    doc.save("payment_receipt.pdf");
  };

  useEffect(() => {
    verifyPayment();
  }, [bookingId, transactionId]);

  const verifyPayment = async () => {
    try {
      const reqBody = {
        bookingId: bookingId,
        merchantOrderId: transactionId,
      };
      const response = await cartService.verifyPhonepePayment(reqBody);
      setStatus(response.data.success);
    } catch (error) {
      console.error("Payment verification failed", error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Payment Status
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Verifying payment...</p>
      ) : (
        <>
          <div className="space-y-3 text-lg text-gray-700">
            <p>
              <span className="font-semibold">Booking ID:</span> {bookingId}
            </p>
            <p>
              <span className="font-semibold">Transaction ID:</span>{" "}
              {transactionId}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-white font-medium ${
                  status ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {status ? "Confirmed" : "Failed"}
              </span>
            </p>
          </div>

          {status && (
            <button
              onClick={generatePDF}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:scale-105 transition-transform duration-300"
            >
              Download Receipt
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionPage;
