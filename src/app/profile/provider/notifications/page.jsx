"use client";
import { profileAPI } from "@/api/profile";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [notifications, setNotifications] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserNotifications();
  }, [typeFilter]);

  const getUserNotifications = async () => {
    try {
      setLoading(true);
      const response = typeFilter
        ? await profileAPI.filterNotifications({ type: typeFilter })
        : await profileAPI.getUserNotifications();

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
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await profileAPI.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await profileAPI.deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all:", error);
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
        </select>

        <button
          onClick={getUserNotifications}
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
