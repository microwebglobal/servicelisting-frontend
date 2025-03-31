import { useState } from "react";
import { Card, CardImage } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cartService } from "@/api/cartService";

const BookingCard = ({ booking, onClick }) => {
  const [open, setOpen] = useState(false);
  const [bookingToCancell, setBookingToCancell] = useState();
  const [penaltyDetails, setPenaltyDetails] = useState({
    penalty: "No penalty",
  });

  const getImageUrl = (booking) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const item = booking?.BookingItems[0];
    return (
      baseUrl + (item?.serviceItem?.icon_url || item?.packageItem?.icon_url)
    );
  };

  const handleCancelbooking = async (bookingId) => {
    try {
      setBookingToCancell(bookingId);
      setOpen(true);
      const response = await cartService.cancellBookingByCustomer(bookingId);
      console.log(response);
      setPenaltyDetails(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelConfirmBooking = async () => {
    try {
      const response = await cartService.confirmCancellBookingByCustomer(
        bookingToCancell,
        { penalty: penaltyDetails.penalty }
      );
      console.log(response);
      setPenaltyDetails(response);
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
      setBookingToCancell(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-md hover:shadow-lg transition-all cursor-pointer">
      {/* Image & Price Row */}
      <div className="flex items-center gap-4" onClick={onClick}>
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
          <CardImage
            src={getImageUrl(booking)}
            crossOrigin="anonymous"
            className="w-full h-full object-cover scale-110"
            alt="Service"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking?.BookingItems[0]?.packageItem?.name ||
              booking?.BookingItems[0]?.serviceItem?.name}
          </h3>
          <p className="text-sm text-gray-500">
            Booking ID: #{booking.booking_id}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-indigo-600">
            ₹{booking?.BookingPayment?.total_amount}
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Date</span>
          </div>
          <p className="font-medium text-gray-800">{booking.booking_date}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Start Time</span>
          </div>
          <p className="font-medium text-gray-800">{booking.start_time}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Payment Status</span>
          </div>
          <p className="font-semibold text-green-600">
            {booking?.BookingPayment?.payment_status}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <Button
          variant="destructive"
          onClick={() => handleCancelbooking(booking.booking_id)}
        >
          Cancel
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <p>
            <strong>
              {penaltyDetails.penalty === "No penalty applied" ? (
                <>No grace period exceeded penalty will not be apply</>
              ) : (
                <>Grace period exceeded penalty will be apply</>
              )}
            </strong>
          </p>
          <p>
            <strong>Penalty:</strong> {penaltyDetails.penalty}
          </p>
          <p>Are you sure you want to cancel this booking?</p>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleCancelConfirmBooking}>Confirm & Cancel</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingCard;
