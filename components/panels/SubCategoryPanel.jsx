import { BasePanel } from "./BasePanel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal } from "lucide-react";

export const SubCategoryPanel = ({
  subCategories,
  selectedSubCategory,
  selectedCategory,
  onSelect,
  onAction,
  fetchData,
}) => {
  return (
    <BasePanel
      title="Sub Categories"
      onAdd={() => onAction("subCategory", "add")}
      disabled={!selectedCategory}
    >
      <div className="space-y-2">
        {subCategories.map((subCategory) => (
          <div
            className="flex w-full items-center justify-between relative"
            key={subCategory.sub_category_id}
          >
            <Button
              variant={
                selectedSubCategory?.sub_category_id ===
                subCategory.sub_category_id
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() => onSelect(subCategory)}
            >
              {subCategory.name}
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
                  onClick={() => onAction("subCategory", "edit", subCategory)}
                >
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("subCategory", "delete", subCategory)}
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
