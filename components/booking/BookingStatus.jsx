// BookingStatus.js
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const statuses = [
  { name: "Accepted", value: "accepted" },
  { name: "Confirmed", value: "confirmed" },
  { name: "Assigned", value: "assigned" },
  { name: "In Progress", value: "in_progress" },
  { name: "Completed", value: "completed" },
  { name: "Cancelled", value: "cancelled" },
  { name: "Refunded", value: "refunded" },
];

const BookingStatus = ({ selectedStatus, onStatusChange }) => {
  return (
    <div className="gap-3 flex px-8">
      {statuses.map((status) => (
        <Badge
          variant={selectedStatus === status.value ? "secondary" : "outline"}
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className={cn("py-1.5 px-4 cursor-pointer", {
            "bg-[#5f60b9]/10 text-[#5f60b9]": selectedStatus === status.value,
          })}
        >
          <span className="font-medium">{status.name}</span>
        </Badge>
      ))}
    </div>
  );
};

export default BookingStatus;
