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
import { useSocket } from "@src/context/SocketContext.js";

const CustomerProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [currentOtp, setCurrentOtp] = useState(null);
  const router = useRouter();
  const { logout, user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !user?.uId) return;

    const onConnect = () => {
      console.log("🔌 Connected:", socket.id);
      socket.emit("join-booking", user.uId);
      setIsSocketReady(true);
    };

    const onDisconnect = () => {
      console.log("🔌 Disconnected");
      setIsSocketReady(false);
    };

    const onConnectError = (err) => {
      console.error("Connection error:", err);
      setIsSocketReady(false);
    };

    const onOtpReceived = (data) => {
      setCurrentOtp(data.otp);
      toast({
        title: "OTP Received",
        description: data.customerMessage
          ? `${data.customerMessage}`
          : `Your booking OTP is ${data.otp}`,
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("otp-generated", onOtpReceived);

    if (!socket.connected) {
      console.log("Attempting to connect socket...");
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("otp-generated", onOtpReceived);
    };
  }, [socket, user?.uId]);

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

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    logout();
    router.push("/login");
  };

  if (isLoading || !isSocketReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">
          {!isSocketReady
            ? "Connecting to real-time service..."
            : "Loading profile..."}
        </span>
      </div>
    );
  }

  return (
    <div className="flex ml-20 flex-col md:flex-row min-h-screen bg-gray-50">
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
