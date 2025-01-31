// BookingTimeline.js
import Image from "next/image";
import { formatDate } from '../../utils/bookingUtils';

const bookingStatuses = [
  { 
    value: 'cart', 
    label: 'Booking Initiated',
    description: 'Service items added to cart'
  },
  { 
    value: 'payment_pending', 
    label: 'Payment Pending',
    description: 'Awaiting payment confirmation'
  },
  { 
    value: 'confirmed', 
    label: 'Booking Confirmed',
    description: 'Payment received and booking confirmed'
  },
  { 
    value: 'assigned', 
    label: 'Provider Assigned',
    description: 'Service provider has been assigned'
  },
  { 
    value: 'in_progress', 
    label: 'Service In Progress',
    description: 'Service is being delivered'
  },
  { 
    value: 'completed', 
    label: 'Service Completed',
    description: 'Service has been completed'
  }
];

const getStatusColor = (currentStatus, statusValue) => {
  const statusIndex = bookingStatuses.findIndex(s => s.value === statusValue);
  const currentIndex = bookingStatuses.findIndex(s => s.value === currentStatus);
  
  if (currentIndex === -1) return 'bg-gray-300';
  
  if (statusIndex <= currentIndex) {
    return 'bg-indigo-500';
  }
  
  return 'bg-gray-300';
};

const BookingTimeline = ({ booking }) => {
  if (!booking) return null;

  const currentStatus = booking.status;
  const isCancelled = currentStatus === 'cancelled';
  const isRefunded = currentStatus === 'refunded';

  return (
    <div className="space-y-8">
      {/* Service Images */}
      <div className="border rounded-lg overflow-hidden bg-white">
        {booking.BookingItems?.[0]?.serviceItem?.images?.[0] && (
          <Image
            src={booking.BookingItems[0].serviceItem.images[0]}
            width={500}
            height={250}
            className="w-full h-64 object-cover"
            alt="Service"
          />
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Booking Timeline</h3>
        
        <div className="relative border-l-4 border-gray-200 ml-3 space-y-8 pb-8">
          {bookingStatuses.map((status, index) => {
            const isActive = bookingStatuses
              .slice(0, bookingStatuses.findIndex(s => s.value === currentStatus) + 1)
              .map(s => s.value)
              .includes(status.value);
            
            return (
              <div key={status.value} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[1.875rem] w-4 h-4 rounded-full ${
                    getStatusColor(currentStatus, status.value)
                  }`}
                ></div>
                
                {/* Status content */}
                <div className="ml-6">
                  <p className={`font-semibold ${
                    isActive ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {status.label}
                  </p>
                  <p className={`text-sm ${
                    isActive ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {status.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Show cancellation or refund status if applicable */}
          {(isCancelled || isRefunded) && (
            <div className="relative">
              <div className="absolute -left-[1.875rem] w-4 h-4 rounded-full bg-red-500"></div>
              <div className="ml-6">
                <p className="font-semibold text-red-500">
                  {isRefunded ? 'Booking Refunded' : 'Booking Cancelled'}
                </p>
                {booking.cancellation_reason && (
                  <p className="text-sm text-gray-600">
                    Reason: {booking.cancellation_reason}
                  </p>
                )}
                {booking.cancelled_by && (
                  <p className="text-sm text-gray-600">
                    Cancelled by: {booking.cancelled_by}
                  </p>
                )}
                {booking.cancellation_time && (
                  <p className="text-sm text-gray-600">
                    On: {formatDate(booking.cancellation_time)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTimeline;