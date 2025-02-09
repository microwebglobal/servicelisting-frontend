import { BasePanel } from "./BasePanel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal } from "lucide-react";

export const CategoryPanel = ({
  categories,
  selectedCategory,
  onSelect,
  onAction,
  onClick,
  fetchData,
}) => {
  return (
    <BasePanel title="Categories" onAdd={() => onAction("category", "add")}>
      <div className="space-y-2">
        {categories.map((category) => (
          <div
            className="flex w-full items-center justify-between relative"
            key={category.category_id}
          >
            <Button
              variant={
                selectedCategory?.category_id === category.category_id
                  ? "secondary"
                  : "ghost"
              }
              className="flex-1 min-w-0 truncate justify-start"
              onClick={() => onSelect(category)}
            >
              {category.name}
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
                  onClick={() => onAction("category", "edit", category)}
                >
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("category", "delete", category)}
                  className="text-red-600"
                >
                  Delete Item
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onClick("category", category)}
                  className="text-red-600"
                >
                  View Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </BasePanel>
  );
};
