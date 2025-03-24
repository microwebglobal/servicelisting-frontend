import { Card, CardImage } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

const BookingCard = ({ booking, onClick }) => {
  console.log(booking);
  const getImageUrl = (booking) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const item = booking?.BookingItems[0];
    return (
      baseUrl + (item?.serviceItem?.icon_url || item?.packageItem?.icon_url)
    );
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-5 shadow-md hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Image & Price Row */}
      <div className="flex items-center gap-4">
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
        <Button variant="destructive">Cancel</Button>
      </div>
    </div>
  );
};

export default BookingCard;
