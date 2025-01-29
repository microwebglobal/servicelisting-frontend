"use client";
import React, { useState } from "react";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card" },
    { id: "upi", label: "UPI" },
    { id: "net_banking", label: "Net Banking" },
  ];

  const banks = ["SBI", "HDFC", "ICICI", "Axis", "PNB"];

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    let paymentDetails = "";

    if (selectedMethod === "card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv
      ) {
        alert("Please fill in all the card details.");
        return;
      }
      paymentDetails = `Card Number: ${cardDetails.cardNumber}, Expiry: ${cardDetails.expiryDate}, CVV: ${cardDetails.cvv}`;
    } else if (selectedMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID.");
        return;
      }
      paymentDetails = `UPI ID: ${upiId}`;
    } else if (selectedMethod === "net_banking") {
      if (!bank) {
        alert("Please select a bank.");
        return;
      }
      paymentDetails = `Bank: ${bank}`;
    }

    alert(`Payment initiated using ${selectedMethod}. ${paymentDetails}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Select Payment Method
        </h1>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center p-4 border rounded-xl cursor-pointer ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="text-2xl mr-4">{method.icon}</span>
              <span className="text-lg text-gray-700">{method.label}</span>
            </div>
          ))}
        </div>

        {selectedMethod === "card" && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={cardDetails.cardNumber}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cardNumber: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={cardDetails.expiryDate}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, expiryDate: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={cardDetails.cvv}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cvv: e.target.value })
              }
            />
          </div>
        )}

        {selectedMethod === "upi" && (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter UPI ID"
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {selectedMethod === "net_banking" && (
          <div className="mt-6">
            <select
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              <option value="">Select Bank</option>
              {banks.map((bankName) => (
                <option key={bankName} value={bankName}>
                  {bankName}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="mt-6 w-full bg-black text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-600 transition"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
