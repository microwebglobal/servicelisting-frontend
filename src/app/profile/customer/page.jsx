"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/context/AuthContext";
import { profileAPI } from "@/api/profile";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ProfileContent from "@components/profile/ProfileContent";
import EmailVerificationDialog from "@components/profile/EmailVerificationDialog";
import withAuth from "@/components/isAuth";

const CustomerProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();
  const { logout, user } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    if (!user?.uId) return;

    try {
      const response = await profileAPI.getProfileByUserId(user.uId);
      setUserData(response.data);
      setIsEmailDialogOpen(
        !response.data.email_verified && response.data.email
      );
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        logout();
        router.push("/login/user");
      }
    }
  }, [user, logout, router]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <ProfileContent userData={userData} />

      <EmailVerificationDialog
        isOpen={isEmailDialogOpen}
        setIsOpen={setIsEmailDialogOpen}
        isEmailSent={isEmailSent}
        setIsEmailSent={setIsEmailSent}
        userId={user?.uId}
      />
    </div>
  );
};

export default withAuth(CustomerProfile, ["customer"]);
