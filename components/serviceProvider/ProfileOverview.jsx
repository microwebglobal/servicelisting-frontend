"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  BookCheck,
  Calendar,
  Clock,
  Shield,
  Star,
  Trophy,
  UserCheck,
  Heart,
  MapPin,
  Bell,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AccountBalance } from "@mui/icons-material";
import { formatCurrency } from "@/utils/bookingUtils";
import { profileAPI } from "@/api/profile";
import { toast } from "@hooks/use-toast";
import { providerAPI } from "@/api/provider";

const ProfileOverview = ({ userData, onSettle }) => {
  console.log(userData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityOverview, setActivityOverview] = useState();

  useEffect(() => {
    fetchActivityOverview();
  }, []);

  const fetchActivityOverview = async () => {
    try {
      const response = await providerAPI.getActivityOverview();
      setActivityOverview(response.data);
      console.log(response.data);
    } catch (error) {
      console.error();
    }
  };

  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    const requiredFields = ["email", "gender", "dob", "mobile", "photo"];
    const optionalFields = ["email_verified", "mobile_verified"];

    const requiredScore =
      requiredFields.filter((field) => userData.User[field]).length * 15;
    const optionalScore =
      optionalFields.filter((field) => userData.User[field]).length * 10;

    return Math.min(requiredScore + optionalScore, 100);
  };

  const completionPercentage = getProfileCompletion();

  // Get profile status and next steps
  const getProfileStatus = () => {
    if (completionPercentage === 100) return "Complete";
    if (completionPercentage >= 70) return "Almost Complete";
    if (completionPercentage >= 40) return "In Progress";
    return "Just Started";
  };

  const getMissingFields = () => {
    const missing = [];
    if (!userData.User.email) missing.push("Email Address");
    if (!userData.User.email_verified) missing.push("Email Verification");
    if (!userData.User.gender) missing.push("Gender");
    if (!userData.User.dob) missing.push("Date of Birth");
    if (!userData.User.mobile) missing.push("Mobile Number");
    if (!userData.User.mobile_verified) missing.push("Mobile Verification");
    if (!userData.User.photo) missing.push("Profile Photo");
    return missing;
  };

  // Mock data for service usage (replace with real data)
  const serviceUsage = {
    totalBookings: 12,
    completedBookings: 8,
    savedServices: 5,
    favoriteLocations: 3,
    lastBooking: "2024-01-15",
    upcomingBookings: 2,
  };

  const handleSettleProviderAccBalance = async () => {
    try {
      await profileAPI.settleProviderAccBalance();
      setIsModalOpen(false);
      onSettle();
      toast({
        title: "Success!",
        description: "Payment Settled Sucessfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed To Settle Payment",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Profile Overview</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2">
                      <Trophy
                        className={`h-5 w-5 ${
                          completionPercentage === 100
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile Status: {getProfileStatus()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Profile Completion
                  </span>
                  <span className="text-sm text-gray-500">
                    {completionPercentage}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              {getMissingFields().length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Complete Your Profile
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {getMissingFields().map((field) => (
                          <li
                            key={field}
                            className="text-sm text-yellow-700 flex items-center gap-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats Card */}
          <div className="space-y-5">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Balance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AccountBalance className="h-10 w-10 text-blue-500" />
                    <p className="text-xl font-bold">
                      {formatCurrency(userData?.User?.acc_balance ?? 0)}
                    </p>
                  </div>
                </div>
                <p>
                  Last Updated at: <span>{userData?.User?.acc_balance}</span>
                </p>
                {userData?.User?.acc_balance > 0 ? (
                  <p className="text-sm text-gray-600">
                    This amount will be credit for the your bank.
                  </p>
                ) : (
                  <Button onClick={() => setIsModalOpen(true)}>
                    Settle Balance
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookCheck className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Total Compleated Bookings</span>
                  </div>
                  <span className="font-medium">
                    {activityOverview?.completedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm">Total Selected Categories</span>
                  </div>
                  <span className="font-medium">
                    {userData?.providerCategories?.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Total Serve Cities</span>
                  </div>
                  <span className="font-medium">
                    {userData?.serviceCities?.length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity & Upcoming Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activityOverview?.acceptedCount > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {activityOverview?.acceptedCount} Accepted{" "}
                      {activityOverview?.acceptedCount === 1
                        ? "Booking"
                        : "Bookings"}
                    </p>
                    <p className="text-xs text-blue-700">Check your schedule</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      No Accepted Bookings Found
                    </p>
                    <p className="text-xs text-blue-700">Check your schedule</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Next Booking</p>
                  {activityOverview?.nextBooking ? (
                    <p className="text-xs text-gray-500">
                      {new Date(
                        activityOverview?.nextBooking?.booking_date
                      ).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No Sheduled Booking Found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Account Security Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Email Verification</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    userData.email_verified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {userData.email_verified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Mobile Verification</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    userData.mobile_verified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {userData.mobile_verified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Notification Preferences */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Manage
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Manage how you receive booking updates, promotions, and account
            alerts
          </p>
        </Card>

        {/* Help & Support */}
        <div className="text-center p-6">
          <p className="text-sm text-gray-500">
            Need help? Our support team is available 24/7
          </p>
          <Button variant="link" className="text-primary mt-1">
            Contact Support
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Settlement</h2>
            <p className="text-gray-700">
              Are you sure you want to settle this payout of{" "}
              <span className="font-bold text-green-600">
                {formatCurrency(userData?.User?.acc_balance)}
              </span>{" "}
            </p>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-gray-500 text-white px-4 py-2 mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white px-4 py-2"
                onClick={handleSettleProviderAccBalance}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfileOverview;
