"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { providerAPI } from "@/api/provider";

const BookingStartModal = ({ booking, onConfirm, onClose }) => {
  console.log(booking);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const isOtpValid = await providerAPI.bookingStartVerify({
        bookingId: booking.id || booking?.booking_id,
        otp: otp,
      });

      console.log(isOtpValid);

      if (isOtpValid?.data?.success) {
        onConfirm(booking);
        onClose();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-md p-6">
      <DialogHeader>
        <DialogTitle>Confirm Booking Start</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Please enter the 6-digit OTP sent to your registered mobile number to
          start the booking.
        </p>

        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          className="text-center text-lg font-semibold"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          className="w-full"
          onClick={handleVerifyOtp}
          disabled={isLoading || !otp || otp.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP and Start Booking"
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

export default BookingStartModal;
