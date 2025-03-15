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

const Page = () => {
  const [userData, setUserData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await providerAPI.getProviderByUserId(user.uId);
        setProfileData(response.data);

        setIsDialogOpen(
          !response.data?.User?.email_verified && response.data?.User?.email
        );
        console.log(response.data);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchProviderData();
  }, []);

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
      <div className="pt-20 bg-gray-100">
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
          <div className="lg:col-span-2">
            <h2 className="text-3xl text-gray-800 mb-6 pb-2 ml-10">Services</h2>

            {/* Service Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 ml-10 mr-10">
              {profileData.ServiceCategories?.length > 0 ? (
                profileData.ServiceCategories.map((service) => (
                  <Card
                    key={service.category_id}
                    className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                  >
                    <CardImage
                      src={
                        process.env.NEXT_PUBLIC_API_ENDPOINT + service.icon_url
                      }
                      crossOrigin="anonymous"
                      style={{
                        height: "150px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                      alt="card_image"
                    />

                    <CardHeader>
                      <CardTitle className="text-2xl hover:text-indigo-600 transition-colors">
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-2">
                  No services added yet.
                </p>
              )}
            </div>

            {/* Additional Details */}
            <div className="mt-10 ml-10 mr-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Additional Details
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Business Name:</span>{" "}
                {profileData.business_name || "Not Available"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Experience:</span>{" "}
                {profileData.years_experience || 0} years
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Contact:</span>{" "}
                {profileData.mobile || "N/A"} /{" "}
                {profileData.whatsapp_number || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Payment Method:</span>{" "}
                {profileData.payment_method || "Not Specified"}
              </p>
            </div>
          </div>
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
