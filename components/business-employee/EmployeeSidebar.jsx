"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, BookCheck, Settings, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EmployeeSidebar = ({ profileData }) => {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      localStorage.clear();

      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Redirect to login
      router.push("login/service-provider");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoadingLogout(false);
      setShowLogoutDialog(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const navigationItems = [
    {
      label: "Orders",
      icon: BookCheck,
      path: "/profile/business-employee",
    },

    {
      label: "Payments",
      icon: Settings,
      path: "/profile/business-employee/payments",
    },
  ];

  return (
    <aside className="bg-white shadow p-6 w-72 h-screen overflow-y-auto">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative">
            <Image
              src={profileData?.User?.photo || "/assets/images/def_pro.webp"}
              alt="Provider Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            {profileData?.status === "active" && (
              <div className="absolute -right-1 -bottom-1">
                <div className="relative group">
                  <Image
                    src="/assets/images/verify_badge.png"
                    alt="Verified Badge"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Verified Provider
                  </span>
                </div>
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mt-3 text-center">
            {profileData?.User?.name}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            {profileData?.ServiceProvider?.business_name}
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Email</p>
            <p className="text-sm text-gray-600 break-words">
              {profileData?.User?.email}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Contact</p>
            <p className="text-sm text-gray-600">{profileData?.User?.mobile}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Member Since</p>
            <p className="text-sm text-gray-600">
              {formatDate(profileData?.User?.created_at)}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3 mt-5">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="outline"
              className="w-full justify-start hover:bg-gray-50"
              onClick={() => router.push(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="justify-end">
          <Button
            variant="destructive"
            className="w-full mt-10"
            onClick={() => setShowLogoutDialog(true)}
            disabled={loadingLogout}
          >
            {loadingLogout ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Logout
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You&apos;ll need to log in again
              to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingLogout}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={loadingLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              {loadingLogout && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default EmployeeSidebar;
