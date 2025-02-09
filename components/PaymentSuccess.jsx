import React from "react";
import { jsPDF } from "jspdf";

const PaymentSuccess = ({ paymentData }) => {
  console.log(paymentData);
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Payment Recipt!`, 20, 30);
    doc.text(`Booking ID: ${paymentData?.id}`, 20, 40);
    doc.text(`Amount: $${paymentData?.amount}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 70);

    doc.save("payment_receipt.pdf");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Payment Successful!
        </h1>
        <div className="mb-6 p-4 bg-gray-100 rounded-2xl shadow-sm">
          <p className="text-gray-700 font-semibold text-lg">
            Amount:{" "}
            <span className="text-blue-600 font-bold">
              ${paymentData.amount}
            </span>
          </p>
          <p className="text-gray-700 font-semibold text-lg">
            Payment Method: {paymentData.method}
          </p>
        </div>
        <button
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          onClick={generatePDF}
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
