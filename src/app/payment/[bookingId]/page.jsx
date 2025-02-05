"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cartService } from "@api/cartService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Wallet, Loader2 } from "lucide-react";
import PaymentSuccess from "@components/PaymentSuccess";

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
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
        if (response.status !== 'payment_pending') {
          throw new Error("This payment has already been completed.");
        }
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
        amount: bookingData?.BookingPayment?.total_amount,
        paymentMethod: selectedMethod,
      };

      const response = await cartService.proceedPayment(paymentDetails);
      setPaymentResponse(response);

      if (response.success) {
        if (selectedMethod === 'cash') {
          await cartService.completeCashPayment(bookingData.booking_id);
        }
      }
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
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-lg font-medium">
                Total Amount:{" "}
                <span className="font-bold text-primary">
                  ₹{formatCurrency(bookingData.BookingPayment.total_amount)}
                </span>
              </p>
            </div>
          )}

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
              variant={selectedMethod === "cash" ? "default" : "outline"}
              className="h-20 text-lg flex gap-3"
              onClick={() => setSelectedMethod("cash")}
            >
              <Wallet className="h-6 w-6" />
              Pay with Cash
            </Button>
          </div>

          {selectedMethod === "cash" && (
            <Alert>
              <AlertDescription>
                Payment will be collected in cash after service completion
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
              : selectedMethod === "cash"
              ? "Confirm Cash Payment"
              : "Proceed to Payment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;