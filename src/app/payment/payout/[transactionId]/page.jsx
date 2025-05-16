"use client";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useSearchParams } from "next/navigation";
import { providerAPI } from "@/api/provider";
import Footer from "@/components/layout/Footer";

const TransactionPage = ({ params }) => {
  const { transactionId } = params;
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [bookingIds, setBookingIds] = useState([]);
  const [error, setError] = useState("");

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Receipt", 20, 20);
    doc.setFontSize(12);

    bookingIds.forEach((id, index) => {
      doc.text(`Booking ID ${index + 1}: ${id}`, 20, 40 + index * 10);
    });

    doc.text(
      `Transaction ID: ${transactionId}`,
      20,
      40 + bookingIds.length * 10 + 10
    );
    doc.text(
      `Date: ${new Date().toLocaleString()}`,
      20,
      40 + bookingIds.length * 10 + 20
    );
    doc.text(
      `Status: ${status ? "Confirmed" : "Failed"}`,
      20,
      40 + bookingIds.length * 10 + 30
    );

    doc.save("payment_receipt.pdf");
  };

  useEffect(() => {
    verifyPayment();
  }, [transactionId, date]);

  const verifyPayment = async () => {
    try {
      const reqBody = {
        merchantOrderId: transactionId,
        date,
      };
      const response = await providerAPI.verifyProviderDuePayment(reqBody);
      setStatus(response.data.success);
      if (response.data.bookingIds) {
        setBookingIds(response.data.bookingIds);
      }
    } catch (err) {
      console.error("Payment verification failed", err);
      setStatus(false);
      setError("Unable to verify payment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Payment Status
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Verifying payment...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="space-y-3 text-lg text-gray-700">
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
              {bookingIds.length > 0 && (
                <div>
                  <p className="font-semibold">Related Booking IDs:</p>
                  <ul className="list-disc list-inside text-sm">
                    {bookingIds.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
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
      <Footer />
    </>
  );
};

export default TransactionPage;
