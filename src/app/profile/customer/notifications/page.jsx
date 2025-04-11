"use client";
import { profileAPI } from "@/api/profile";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [notifications, setNotifications] = useState([]); // default to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserNotifications();
  }, []);

  const getUserNotifications = async () => {
    try {
      const response = await profileAPI.getUserNotifications();
      console.log(response.data.data);

      setNotifications(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await profileAPI.readNotification(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="ml-24 p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Notifications
      </h1>

      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-md ${
                notification.isRead ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex justify-between">
                <p className="font-semibold text-gray-800">
                  {notification.message}
                </p>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-500"
                  disabled={notification.isRead}
                >
                  Mark as Read
                </button>
              </div>
              <p className="text-sm text-gray-500">{notification.created_at}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
