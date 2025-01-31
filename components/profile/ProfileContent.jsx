import React from 'react';
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
  Bell
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProfileContent = ({ userData }) => {
  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    const requiredFields = ['email', 'gender', 'dob', 'mobile', 'photo'];
    const optionalFields = ['email_verified', 'mobile_verified'];
    
    const requiredScore = requiredFields.filter(field => userData[field]).length * 15;
    const optionalScore = optionalFields.filter(field => userData[field]).length * 10;
    
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
    if (!userData.email) missing.push('Email Address');
    if (!userData.email_verified) missing.push('Email Verification');
    if (!userData.gender) missing.push('Gender');
    if (!userData.dob) missing.push('Date of Birth');
    if (!userData.mobile) missing.push('Mobile Number');
    if (!userData.mobile_verified) missing.push('Mobile Verification');
    if (!userData.photo) missing.push('Profile Photo');
    return missing;
  };

  // Mock data for service usage (replace with real data)
  const serviceUsage = {
    totalBookings: 12,
    completedBookings: 8,
    savedServices: 5,
    favoriteLocations: 3,
    lastBooking: '2024-01-15',
    upcomingBookings: 2
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
                      <Trophy className={`h-5 w-5 ${
                        completionPercentage === 100 ? 'text-yellow-500' : 'text-gray-400'
                      }`} />
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
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-gray-500">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              {getMissingFields().length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Complete Your Profile</h4>
                      <ul className="mt-2 space-y-1">
                        {getMissingFields().map(field => (
                          <li key={field} className="text-sm text-yellow-700 flex items-center gap-2">
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
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookCheck className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Total Bookings</span>
                </div>
                <span className="font-medium">{serviceUsage.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Saved Services</span>
                </div>
                <span className="font-medium">{serviceUsage.savedServices}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Favorite Locations</span>
                </div>
                <span className="font-medium">{serviceUsage.favoriteLocations}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity & Upcoming Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {serviceUsage.upcomingBookings > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {serviceUsage.upcomingBookings} Upcoming {serviceUsage.upcomingBookings === 1 ? 'Booking' : 'Bookings'}
                    </p>
                    <p className="text-xs text-blue-700">Check your schedule</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Last Booking</p>
                  <p className="text-xs text-gray-500">
                    {new Date(serviceUsage.lastBooking).toLocaleDateString()}
                  </p>
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
                <span className={`text-sm font-medium ${
                  userData.email_verified ? 'text-green-600' : 'text-red-600'
                }`}>
                  {userData.email_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Mobile Verification</span>
                </div>
                <span className={`text-sm font-medium ${
                  userData.mobile_verified ? 'text-green-600' : 'text-red-600'
                }`}>
                  {userData.mobile_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Notification Preferences */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Manage
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Manage how you receive booking updates, promotions, and account alerts
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
    </main>
  );
};

export default ProfileContent;