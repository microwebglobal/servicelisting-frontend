// BookingCard.js
import { Card, CardImage } from "@/components/ui/card";

const BookingCard = ({ booking, onClick }) => {
  const getImageUrl = (booking) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const item = booking?.BookingItems[0];
    return baseUrl + (item?.serviceItem?.icon_url || item?.packageItem?.icon_url);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="rounded-lg border mb-4 overflow-hidden">
        <CardImage
          src={getImageUrl(booking)}
          crossOrigin="anonymous"
          className="h-48 w-full object-cover"
          alt="Service"
        />
      </div>
      
      <div className="flex justify-between px-2">
        <div className="space-y-1">
          {booking?.BookingItems.map((item, index) => (
            <h3 key={index} className="text-lg font-semibold text-gray-800">
              {item?.packageItem?.name || item?.serviceItem?.name}
            </h3>
          ))}
        </div>
        <div className="text-right">
          <p className="mb-2 text-gray-600">{booking.booking_id}</p>
          <p className="text-lg font-semibold text-indigo-600">
            ₹{booking?.BookingPayment?.total_amount}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-5 rounded-lg mt-5 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Date</p>
          <p className="font-medium text-gray-800">{booking.booking_date}</p>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Start Time</p>
          <p className="font-medium text-gray-800">{booking.start_time}</p>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Payment Status</p>
          <p className="font-medium text-green-600">
            {booking?.BookingPayment?.payment_status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;