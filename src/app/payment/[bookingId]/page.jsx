"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cartService } from "@api/cartService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Wallet, Loader2, AlertCircleIcon } from "lucide-react";
import PaymentSuccess from "@components/PaymentSuccess";

const formatCurrency = (value) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentType, setPaymentType] = useState("full"); // "advance" or "full"
  const [bookingData, setBookingData] = useState();
  const [paymentResponse, setPaymentResponse] = useState();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const response = await cartService.getBooking(params.bookingId);
        if (response.status !== "payment_pending") {
          throw new Error("This payment has already been completed.");
        }
        console.log(response);
        setBookingData(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.bookingId) {
      fetchBookingData();
    }
  }, [params.bookingId]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError("Please select a payment method.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const paymentDetails = {
        bookingId: bookingData?.booking_id,
        paymentType,
        paymentMethod: selectedMethod,
      };

      console.log(paymentDetails);

      const response = await cartService.proceedPayment(paymentDetails);
      setPaymentResponse(response);

      // if (response.success && selectedMethod === "cash") {
      //   await cartService.completeCashPayment(bookingData.booking_id);
      // }
    } catch (error) {
      setError(error.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentResponse?.success) {
    return <PaymentSuccess paymentData={paymentResponse} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Choose Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {bookingData?.BookingPayment && (
            <div className="border-t pt-4 space-y-2 bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹{formatCurrency(bookingData.BookingPayment.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>
                  ₹{formatCurrency(bookingData.BookingPayment.tax_amount)}
                </span>
              </div>
              {bookingData.customer.acc_balance && (
                <div className="flex justify-between">
                  <span>Previous Balance</span>
                  <span>
                    ₹{formatCurrency(bookingData.customer.acc_balance)}
                  </span>
                </div>
              )}
              {bookingData.BookingPayment.tip_amount > 0 && (
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>
                    ₹{formatCurrency(bookingData.BookingPayment.tip_amount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>
                  ₹
                  {formatCurrency(
                    parseFloat(bookingData.BookingPayment.total_amount) +
                      parseFloat(bookingData.customer.acc_balance)
                  )}
                </span>
              </div>
              {bookingData.BookingPayment.advance_payment > 0 && (
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Advance Amount</span>
                  <span>
                    ₹
                    {formatCurrency(bookingData.BookingPayment.advance_payment)}
                  </span>
                </div>
              )}
            </div>
          )}

          {paymentType === "advance" && (
            <p className="text-red-400 flex items-center">
              <AlertCircleIcon className="mr-3 w-10" />
              <span>
                You should pay the remaining{" "}
                {formatCurrency(
                  Number(bookingData.BookingPayment.total_amount) -
                    Number(bookingData.BookingPayment.advance_payment)
                )}{" "}
                after completing the service.
              </span>
            </p>
          )}

          {/* Payment Type Selection */}
          {bookingData.BookingPayment.advance_payment > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentType === "advance" ? "default" : "outline"}
                className="h-16 text-lg whitespace-normal p-2"
                onClick={() => setPaymentType("advance")}
              >
                Pay Advance
                {bookingData.customer.acc_balance > 0 &&
                  " + Previous Balance"}{" "}
              </Button>

              <Button
                variant={paymentType === "full" ? "default" : "outline"}
                className="h-16 text-lg"
                onClick={() => setPaymentType("full")}
              >
                Pay Full Amount
              </Button>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant={selectedMethod === "card" ? "default" : "outline"}
              className="h-20 text-lg flex gap-3"
              onClick={() => setSelectedMethod("card")}
            >
              <CreditCard className="h-6 w-6" />
              Pay Online
            </Button>

            <Button
              variant={selectedMethod === "net_banking" ? "default" : "outline"}
              className="h-20 text-lg flex gap-3"
              onClick={() => setSelectedMethod("net_banking")}
            >
              <Wallet className="h-6 w-6" />
              Bank Transfer
            </Button>

            {bookingData.BookingPayment.advance_payment == 0 && (
              <Button
                variant={selectedMethod === "cash" ? "default" : "outline"}
                className="h-20 text-lg flex gap-3"
                onClick={() => setSelectedMethod("cash")}
              >
                <Wallet className="h-6 w-6" />
                Pay After Service Compleated
              </Button>
            )}
          </div>

          {selectedMethod === "net_banking" && (
            <Alert severity="info">
              <AlertTitle>Payment Information</AlertTitle>
              <AlertDescription>
                Please upload the payment slip after completing the payment.
                <br />
                <strong>Bank Details:</strong>
                <br />
                <strong>Account No:</strong> 123456789
                <br />
                <strong>Name:</strong> ABC
                <br />
                <strong>Branch:</strong> Main Street
                <br />
                <strong>SWIFT Code:</strong> ABCD1234
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : selectedMethod === "bank"
              ? `Confirm Bank Payment (${
                  paymentType === "advance" ? "Advance" : "Full"
                })`
              : `Proceed to Payment (${
                  paymentType === "advance" ? "Advance" : "Full"
                })`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
