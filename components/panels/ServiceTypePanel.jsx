import { BasePanel } from "./BasePanel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal } from "lucide-react";

export const ServiceTypePanel = ({
  serviceTypes,
  selectedType,
  selectedSubCategory,
  onSelect,
  onAction,
  fetchData,
}) => {
  console.log(selectedSubCategory); //logger for debugging
  return (
    <BasePanel
      title="Service Types"
      onAdd={() => onAction("serviceType", "add")}
      disabled={!selectedSubCategory}
    >
      <div className="space-y-2">
        {serviceTypes.map((type) => (
          <div
            className="flex w-full items-center justify-between relative"
            key={type.type_id}
          >
            <Button
              variant={
                selectedType?.type_id === type.type_id ? "secondary" : "ghost"
              }
              className="w-full justify-start"
              onClick={() => onSelect(type)}
            >
              {type.name}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={4}
                avoidCollisions={true}
                className="z-50"
              >
                <DropdownMenuItem
                  onClick={() => onAction("serviceType", "edit", type)}
                >
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("serviceType", "delete", type)}
                  className="text-red-600"
                >
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </BasePanel>
  );
};
