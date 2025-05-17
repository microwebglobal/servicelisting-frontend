import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal } from "lucide-react";

export const ServiceItemsPanel = ({
  service,
  items = [],
  onAction,
  isLoading = false,
  onClick,
}) => {
  if (!service) {
    return (
      <div className="text-center text-sm text-gray-500">
        Select a service to view items
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-4 text-sm text-gray-500">
        Loading items...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-slate-100 p-2 text-center">
        <div>
          <h3 className="text-lg font-medium">{service.name} Items</h3>
          <p className="text-sm text-gray-500">${service.price}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onAction("serviceItem", "add", { serviceId: service.service_id })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center p-4 text-sm text-gray-500">
            No items found for this service
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.item_id}
              className="flex items-center justify-between p-3 rounded-lg border bg-white"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onClick?.("service_item", item)}
              >
                <p className="font-medium">{item.name}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onAction("serviceItem", "edit", item)}
                  >
                    Edit Item
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onAction("serviceItem", "delete", item)}
                    className="text-red-600"
                  >
                    Delete Item
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
