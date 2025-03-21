"use client";
import { providerAPI } from "@/api/provider";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@hooks/use-toast";

const Page = () => {
  const [providerId, setProviderId] = useState(null);
  const [ongoingBooking, setOngoingBooking] = useState(null);
  const [ongoingPayments, setOngoingPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPayable, setTotalPayable] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user?.uId) {
          setError("Please log in to view bookings");
          setLoading(false);
          return;
        }

        const response = await providerAPI.getProviderByUserId(user.uId);
        if (response.data?.provider_id) {
          setProviderId(response.data.provider_id);
        } else {
          setError("Provider information not found");
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
        setError("Failed to load provider information");
      }
    };

    fetchProviderId();
  }, []);

  useEffect(() => {
    if (!providerId) return;

    const fetchOngoingBooking = async () => {
      try {
        const response = await providerAPI.getProviderBookingPayments(
          providerId
        );
        setOngoingBooking(response?.data?.booking);
        const payments = response?.data?.payment || [];

        setOngoingPayments(payments);

        // Calculate total payable amount
        let totalAmount = payments.reduce((total, payment) => {
          if (
            !["completed", "failed", "refunded", "cancelled"].includes(
              payment.payment_status
            )
          ) {
            total +=
              payment.payment_status === "advance_only_paid"
                ? parseFloat(payment.total_amount) -
                  parseFloat(payment.advance_payment)
                : parseFloat(payment.total_amount);
          }
          return total;
        }, 0);

        setTotalPayable(totalAmount);
      } catch (error) {
        console.error("Error fetching provider booking data:", error);
        setError("Failed to load booking information");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingBooking();
  }, [providerId, isProcessing]);

  const handleConfirmCollect = async () => {
    setIsProcessing(true);
    try {
      await providerAPI.collectBookingPayment(ongoingBooking.booking_id, {
        providerId,
      });
      setIsConfirmOpen(false);
      toast({
        title: "Success!",
        description: "Payment collection confirmed successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No category selected for deletion!",
        variant: "destructive",
      });
      console.error("Error collecting payment:", error);
      setError("Failed to confirm payment collection.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Ongoing Booking Billing Details
      </h2>

      {ongoingBooking ? (
        <div className="border border-gray-300 bg-white p-4 rounded-md shadow-md">
          <p>
            <strong>Booking ID:</strong> {ongoingBooking.booking_id}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No ongoing bookings found.</p>
      )}

      <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">
        Payment Details
      </h2>

      {ongoingPayments.length > 0 ? (
        <div className="border border-gray-300 bg-white p-4 rounded-md shadow-md">
          {ongoingPayments.map((payment) => (
            <div
              key={payment.payment_id}
              className="border-b last:border-none pb-4 mb-4"
            >
              <p>
                <strong>Sub Total:</strong> ${payment?.subtotal}
              </p>
              <p>
                <strong>Tip Amount:</strong> ${payment.tip_amount}
              </p>
              <p>
                <strong>Tax:</strong> ${payment.tax_amount}
              </p>
              <p>
                <strong>Discount:</strong> -${payment.discount_amount}
              </p>
              <p className="text-lg font-bold">
                <strong>Total Amount:</strong> ${payment.total_amount}
              </p>

              <p>
                <strong>Payment Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded ${
                    payment.payment_status === "completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {payment.payment_status}
                </span>
              </p>
            </div>
          ))}

          <div className="text-xl font-semibold mt-4 text-right">
            <strong>Total Payable Amount: </strong>
            <span className="text-blue-600">${totalPayable}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No payments found.</p>
      )}

      {totalPayable !== 0 && (
        <Button
          onClick={() => setIsConfirmOpen(true)}
          disabled={isProcessing}
          className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
        >
          {isProcessing ? "Processing..." : "Confirm Collected"}
        </Button>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment Collection</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to mark this payment as collected?</p>
          <DialogFooter>
            <Button onClick={() => setIsConfirmOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCollect}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? "Processing..." : "Yes, Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
