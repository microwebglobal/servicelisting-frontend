// BookingStatus.js
import { ArrowForwardIosSharp } from "@mui/icons-material";

const statuses = [
  { name: "Pending", value: "payment_pending" },
  { name: "Confirmed", value: "confirmed" },
  { name: "Assigned", value: "assigned" },
  { name: "In Progress", value: "in_progress" },
  { name: "Completed", value: "completed" },
  { name: "Cancelled", value: "cancelled" },
  { name: "Refunded", value: "refunded" },
];

const BookingStatus = ({ onStatusChange }) => {
  return (
    <div className="rounded-lg border px-5 pb-8 mt-8">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition-colors text-white py-3 mt-4 rounded-lg flex items-center justify-between px-4"
        >
          <span className="font-medium">{status.name}</span>
          <ArrowForwardIosSharp className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default BookingStatus;
