"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Modal from "react-modal";
import { LogOut, User } from "lucide-react";

const UserProfileMenu = ({ user, onLogout }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const router = useRouter();

  const handleNavigateToProfile = () => {
    if (user?.role === "customer") router.push("/profile/customer");
    else if (user?.role === "admin") router.push("/admin");
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={user.imageUrl}
              alt="User Avatar"
              className="size-10"
            />

            <AvatarFallback className="size-10 text-primary font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40 mt-3">
          <DropdownMenuItem
            onClick={handleNavigateToProfile}
            className="cursor-pointer"
          >
            <User className="size-4" />
            My Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setConfirmLogout(true)}
            className="text-destructive cursor-pointer focus:text-destructive/90"
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        isOpen={confirmLogout}
        onRequestClose={() => setConfirmLogout(false)}
        ariaHideApp={false}
        className="m-10 bg-white p-6 rounded-lg shadow-xl w-96 max-w-lg"
        overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      >
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            Are you sure you want to log out?
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={() => {
                onLogout();
                setConfirmLogout(false);
              }}
            >
              Yes, Logout
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg w-full"
              onClick={() => setConfirmLogout(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserProfileMenu;
