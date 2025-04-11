"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { profileAPI } from "@/api/profile";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@src/context/AuthContext";
import { Camera, LogOut, MapPin, Calendar } from "lucide-react";
import AddressManager from "./AddressManager";
import ProfileForm from "./ProfileForm";

const ProfileSidebar = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { logout } = useAuth();
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await profileAPI.getProfileByUserId(user.uId);
      console.log(response.data);
      setUserData(response.data);
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await profileAPI.uploadPhoto(formData);
      fetchUserProfile(); // Fetch updated user profile after uploading photo
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!userData) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <aside className="w-full md:w-96 bg-white p-6 border-r border-gray-200 overflow-y-auto h-screen">
      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={userData.photo || "/assets/images/def_pro.webp"}
              alt={userData.name}
              layout="fill"
              className="rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="h-5 w-5 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
          <h2 className="mt-4 text-xl font-semibold">{userData.name}</h2>
          <p className="text-gray-500">{userData.email}</p>
        </div>

        {/* Profile Form */}
        <Card className="p-4">
          <ProfileForm
            userData={userData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdate={fetchUserProfile} // Update profile data after editing
          />
        </Card>

        {/* Address Manager */}
        <AddressManager />

        {/* Navigation Links */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/profile/customer/bookings")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            My Bookings
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/profile/customer/notifications")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/profile/customer/favorites")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Saved Locations
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => handleLogout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
