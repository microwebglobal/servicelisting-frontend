import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ServicesPanel = ({
  selectedType,
  services = [],
  selectedService,
  onSelect,
  onAction,
}) => {
  if (!selectedType) {
    return (
      <div className="text-center text-sm text-gray-500">
        Select a service type to view services
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onAction("service", "add")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Service
      </Button>

      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.service_id}
            className={`flex items-center justify-between p-2 rounded-lg border ${
              selectedService?.service_id === service.service_id
                ? "bg-secondary"
                : ""
            }`}
          >
            <Button
              variant="ghost"
              className="justify-start w-40"
              onClick={() => onSelect(service)}
            >
              <span>{service.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ${service.price}
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onAction("service", "edit", service)}
                >
                  Edit Service
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("service", "delete", service)}
                  className="text-red-600"
                >
                  Delete Service
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("serviceItem", "add", service)}
                >
                  Add Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};
