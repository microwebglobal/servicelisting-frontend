import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";

export const SectionItemsPanel = ({
  section,
  items = [],
  onAction,
  isLoading,
}) => {
  if (!section) {
    return (
      <div className="text-center p-4 text-sm text-gray-500">
        Select a section to view items
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className=" rounded-lg items-center justify-between">
        <div>
          <h3 className="font-medium">{section.name}</h3>
          <p className="text-sm text-gray-500">Items</p>
        </div>
        <Button
          className="w-32 mt-2"
          variant="outline"
          size="sm"
          onClick={() =>
            onAction("packageItem", "add", { sectionId: section.section_id })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.item_id}
            className="flex items-center justify-between p-3 rounded-lg border bg-white w-32"
          >
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-sm text-gray-500">${item.price}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onAction("packageItem", "edit", item)}
                >
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("packageItem", "delete", item)}
                  className="text-red-600"
                >
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};
