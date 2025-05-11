"use client";
import { profileAPI } from "@/api/profile";
import React, { useEffect, useState, useCallback } from "react";
import { useProfileRefresh } from "@src/context/ProfileRefreshContext";
import { Button } from "@/components/ui/button";
import { Sync } from "@mui/icons-material";
import { Settings, Trash } from "lucide-react";

const NotificationSettingsModal = ({ isOpen, onClose, onSave }) => {
  const [preferredMethods, setPreferredMethods] = useState({
    mobile: false,
    email: false,
    whatsapp: false,
  });

  useEffect(() => {
    if (isOpen) {
      const fetchPreferences = async () => {
        try {
          const response = await profileAPI.getUserNotificationSettings();
          setPreferredMethods(response.data.preferences || preferredMethods);
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
      };
      fetchPreferences();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await profileAPI.updateNotificationPreferences(preferredMethods);
      onSave(preferredMethods);
      onClose();
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferredMethods.mobile}
              onChange={(e) =>
                setPreferredMethods((prev) => ({
                  ...prev,
                  mobile: e.target.checked,
                }))
              }
              className="h-4 w-4"
            />
            Mobile Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferredMethods.email}
              onChange={(e) =>
                setPreferredMethods((prev) => ({
                  ...prev,
                  email: e.target.checked,
                }))
              }
              className="h-4 w-4"
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferredMethods.whatsapp}
              onChange={(e) =>
                setPreferredMethods((prev) => ({
                  ...prev,
                  whatsapp: e.target.checked,
                }))
              }
              className="h-4 w-4"
            />
            WhatsApp Notifications
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = ({ currentOtp }) => {
  const [notifications, setNotifications] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    <div className="w-full max-w-5xl">
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

        <Button
          variant="outline"
          onClick={() => {
            getUserNotifications();
            triggerRefresh(); // Trigger global refresh
          }}
        >
          <Sync />
          Refresh
        </Button>

        <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
          <Settings />
          Settings
        </Button>

        <Button variant="destructive" onClick={deleteAllNotifications}>
          <Trash />
          Delete All
        </Button>
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

      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Page;
