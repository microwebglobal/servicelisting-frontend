'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@src/context/AuthContext";
import { profileAPI } from "@/api/profile";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ProfileSidebar from '@components/profile/sidebar';
import ProfileContent from '@components/profile/ProfileContent';
import EmailVerificationDialog from '@components/profile/EmailVerificationDialog';
import withAuth from "@/components/isAuth";

const CustomerProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await profileAPI.getProfileByUserId(user.uId);
      setUserData(response.data);
      setIsEmailDialogOpen(!response.data.email_verified && response.data.email);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        router.push("/login/user");
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <ProfileSidebar 
        userData={userData}
        setUserData={setUserData}
        onLogout={handleLogout}
        onProfileUpdate={fetchUserProfile}
      />
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