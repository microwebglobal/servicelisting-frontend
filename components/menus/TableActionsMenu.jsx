import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash2 } from "lucide-react";
import Modal from "react-modal";
import { useState } from "react";

export default function TableActionsMenu({
  onConfirm,
  isActionLoading,
  moduleName,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="icon">
            <EllipsisVertical className="scale-125" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 mt-2">
          <DropdownMenuLabel>More Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="text-destructive w-full focus:text-destructive justify-start focus:bg-destructive/5 focus-visible:ring-destructive cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Trash2 />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        isOpen={isModalOpen}
        ariaHideApp={false}
        className="m-10 bg-white p-8 rounded-lg shadow-xl w-96 max-w-lg"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
      >
        <div className="space-y-4">
          <p className="font-semibold">
            Are you sure you want to delete this {moduleName}?
          </p>

          <p className="text-sm">
            This record will be permanently deleted and cannot be reversed.
          </p>

          <div className="flex space-x-4">
            <Button
              className="flex-1 bg-destructive hover:bg-destructive/90"
              onClick={() => onConfirm().then(() => setIsModalOpen(false))}
              disabled={isActionLoading}
            >
              {isActionLoading ? "Deleting..." : "Continue"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
