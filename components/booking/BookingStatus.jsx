// BookingStatus.js
import { ArrowForwardIosSharp } from "@mui/icons-material";

const statuses = [
  { name: "Accepted", value: "accepted" },
  { name: "Confirmed", value: "confirmed" },
  { name: "Assigned", value: "assigned" },
  { name: "In Progress", value: "in_progress" },
  { name: "Completed", value: "completed" },
  { name: "Cancelled", value: "cancelled" },
  { name: "Refunded", value: "refunded" },
];

const BookingStatus = ({ onStatusChange }) => {
  return (
    <div className=" gap-3 mt-8 flex">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition-colors text-white py-1 mt-4 rounded-lg flex items-center justify-between px-2"
        >
          <span className="font-medium">{status.name}</span>
        </button>
      ))}
    </div>
  );
};

export default BookingStatus;
