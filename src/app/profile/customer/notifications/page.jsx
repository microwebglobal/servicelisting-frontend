"use client";
import { profileAPI } from "@/api/profile";
import React, { useEffect, useState, useCallback } from "react";
import { useProfileRefresh } from "@src/context/ProfileRefreshContext";

const Page = ({ currentOtp }) => {
  const [notifications, setNotifications] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshKey, triggerRefresh } = useProfileRefresh();

  useEffect(() => {
    console.log("Received currentOtp in Page:", currentOtp);
  }, [currentOtp]);

  const getUserNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = typeFilter
        ? await profileAPI.filterNotifications({ type: typeFilter })
        : await profileAPI.getUserNotifications();

      console.log("Notifications API response:", response.data.data);
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    console.log("useEffect triggered with:", {
      typeFilter,
      refreshKey,
      currentOtp,
    });
    getUserNotifications();
  }, [typeFilter, refreshKey, currentOtp, getUserNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await profileAPI.readNotification(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error.message);
      setError("Failed to mark notification as read.");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await profileAPI.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error.message);
      setError("Failed to delete notification.");
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await profileAPI.deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error.message);
      setError("Failed to delete all notifications.");
    }
  };

  return (
    <div className="ml-24 p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        Notifications
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Types</option>
          <option value="booking">Booking</option>
          <option value="reminder">Reminder</option>
          <option value="general">General</option>
          <option value="otp">OTP</option>
        </select>

        <button
          onClick={() => {
            getUserNotifications();
            triggerRefresh(); // Trigger global refresh
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Refresh
        </button>

        <button
          onClick={deleteAllNotifications}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Delete All
        </button>
      </div>

      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className={`p-4 border rounded-md ${
                notification.isRead ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.notification_id)}
                      className="text-blue-500 hover:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() =>
                      deleteNotification(notification.notification_id)
                    }
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
