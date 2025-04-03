"use client";
import React, { useEffect, useState } from "react";
import withAuth from "@components/isAuth";
import { providerAPI } from "@api/provider";
import { profileAPI } from "@/api/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardImage, CardTitle } from "@/components/ui/card";
import ProfileOverview from "@/components/serviceProvider/ProfileOverview";

const Page = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      const response = await providerAPI.getProviderByUserId(user.uId);
      setProfileData(response.data);

      setIsDialogOpen(
        !response.data?.User?.email_verified && response.data?.User?.email
      );

      setLoading(false);
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const handleEmailValidate = async () => {
    try {
      await profileAPI.sendEmailValidation(user.uId);
      setIsDialogOpen(false);
      setIsEmailSent(true);
      toast({
        title: "Success!",
        description: "Verification email sent successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error;
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row min-h-screen ">
          {!loading && (
            <ProfileOverview
              userData={profileData}
              onSettle={fetchProviderData}
            />
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Email Not Verified!</DialogTitle>
            </DialogHeader>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Please verify your email to complete your profile
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-5">
                <Button variant="destructive" onClick={handleEmailValidate}>
                  Verify Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isEmailSent} onOpenChange={setIsEmailSent}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verification Email Sent to Your Email!</DialogTitle>
            </DialogHeader>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Please check inbox and click verify
                </label>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default withAuth(Page, [
  "service_provider",
  "business_service_provider",
]);
