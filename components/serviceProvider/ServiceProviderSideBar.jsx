"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Rating from "@mui/material/Rating";
import { providerAPI } from "@api/provider";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, BookCheck, Settings, Loader2 } from "lucide-react";
import { PeopleAltSharp } from "@mui/icons-material";
import { format } from "date-fns";
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

const ServiceProviderSideBar = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  const fetchProviderData = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.uId) {
        router.push("/login/user");
        return;
      }

      const response = await providerAPI.getProviderByUserId(user.uId);
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      // Clear local storage
      localStorage.clear();
      // Clear any auth cookies if using them
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Redirect to login
      router.push("/login");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-72 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const navigationItems = [
    {
      label: "Service Management",
      icon: Calendar,
      path: "/profile/provider/services",
    },
    {
      label: "Orders",
      icon: BookCheck,
      path: "/profile/provider/orders",
    },
    ...(profileData?.business_type !== "individual"
      ? [
          {
            label: "Employees",
            icon: PeopleAltSharp,
            path: "/profile/provider/employees",
          },
        ]
      : []),
    {
      label: "Configurations",
      icon: Settings,
      path: "/profile/provider/configurations",
    },
  ];

  return (
    <aside className="bg-white shadow p-6 w-72 h-screen overflow-y-auto">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative">
            <Image
              src={profileData?.photo || "/assets/images/def_pro.webp"}
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
            {profileData?.business_name || profileData?.User?.name}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            {profileData?.business_type} Provider
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Rating
              name="half-rating-read"
              defaultValue={4.5}
              precision={0.5}
              readOnly
              size="small"
            />
            <p className="text-sm font-medium text-gray-800 ml-1">4.5</p>
          </div>
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

export default ServiceProviderSideBar;
