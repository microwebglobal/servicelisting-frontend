"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cartService } from "@api/cartService";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import PaymentSuccess from "@components/PaymentSuccess";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [bookingData, setBookingData] = useState();
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

  const banks = ["Commercial", "HDFC", "BOC", "PEOPLES", "HNB"];
  const [paymentResponse, setPaymentResponse] = useState();
  const [error, setError] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await cartService.getBooking(params.bookingId);

        setBookingData(response);
        console.log(response);
      } catch (error) {
        setError("This payment has already been completed.");
      }
    };

    fetchBookingData();
  }, []);

  const getCardType = (number) => {
    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    if (/^3[47]/.test(number)) return "Amex";
    if (/^6/.test(number)) return "Discover";
    return null;
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    let paymentDetails = {};

    if (selectedMethod === "card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv
      ) {
        alert("Please fill in all the card details.");
        return;
      }
      paymentDetails = {
        method: "card",
        bookingId: bookingData?.BookingPayment?.booking_id,
        amount: bookingData?.BookingPayment?.total_amount,
        cardNumber: cardDetails.cardNumber,
        expiry: cardDetails.expiryDate,
        cvv: cardDetails.cvv,
      };
    } else if (selectedMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID.");
        return;
      }
      paymentDetails = {
        method: "upi",
        upiId: upiId,
      };
    } else if (selectedMethod === "net_banking") {
      if (!bank) {
        alert("Please select a bank.");
        return;
      }
      paymentDetails = {
        method: "net_banking",
        bank: bank,
      };
    }

    console.log(paymentDetails);

    try {
      const response = await cartService.proceedPayment(paymentDetails);
      console.log(response);
      setPaymentResponse(response);
    } catch (error) {
      console.error("Booking payment error:", error);
    }
  };

  if (paymentResponse?.status === "success") {
    return <PaymentSuccess paymentData={paymentResponse} />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-10">
        <AlertTitle>Payment Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200">
        {/* Booking Details */}
        {bookingData ? (
          <div className="mb-6 p-4 bg-gray-100 rounded-2xl shadow-sm">
            <p className="text-gray-700 font-semibold text-lg">
              Amount:{" "}
              <span className="text-blue-600 font-bold">
                ${bookingData?.BookingPayment?.total_amount}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-center mb-6">
            Loading booking details...
          </p>
        )}

        {/* Payment Header */}
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Select Payment Method
        </h1>

        {/* Payment Methods */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedMethod === method.id
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="text-3xl text-blue-700 mr-4">{method.icon}</span>
              <span className="text-lg font-medium text-gray-800">
                {method.label}
              </span>
            </div>
          ))}
        </div>

        {/* Card Payment */}
        {selectedMethod === "card" && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={cardDetails.cardNumber}
                maxLength={16}
                onKeyDown={(e) => {
                  if (
                    !/^\d$/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
              />
              <span className="absolute right-4 top-3 text-2xl text-gray-500">
                {getCardType(cardDetails.cardNumber) === "Visa" && <FaCcVisa />}
                {getCardType(cardDetails.cardNumber) === "Mastercard" && (
                  <FaCcMastercard />
                )}
                {getCardType(cardDetails.cardNumber) === "Amex" && <FaCcAmex />}
                {getCardType(cardDetails.cardNumber) === "Discover" && (
                  <FaCcDiscover />
                )}
              </span>
            </div>
            {!getCardType(cardDetails.cardNumber) && cardDetails.cardNumber && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid card number.
              </p>
            )}
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={cardDetails.expiryDate}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, expiryDate: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {selectedMethod === "net_banking" && (
          <div className="mt-6">
            <select
              className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
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
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
