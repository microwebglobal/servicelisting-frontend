// adminBookingService.js
import { api } from "../utils/api";

export const adminBookingService = {
  getAllBookings: async (filters = {}, page) => {
    try {
      const response = await api.get(`/admin/bookings?page=${page}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking details"
      );
    }
  },

  assignServiceProvider: async (bookingId, providerId) => {
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/assign`, {
        providerId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to assign service provider"
      );
    }
  },

  updateBookingStatus: async (bookingId, status, notes = "") => {
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/status`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  },

  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  },

  getServiceProviders: async (cityId, categoryId) => {
    try {
      const response = await api.get(`/admin/service-providers`, {
        params: { cityId, categoryId },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch service providers"
      );
    }
  },

  getBookingAnalytics: async (timeRange = "week") => {
    try {
      const response = await api.get("/admin/bookings/analytics", {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking analytics"
      );
    }
  },

  getBookingTransactions: async () => {
    try {
      const response = await api.get("/admin/transactions");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  },

  getCancelledBookingsByCustomer: async () => {
    try {
      const response = await api.get("/admin/bookings/cancel/cus");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  },

  handleCancelledBookingPanalty: async (data) => {
    try {
      const response = await api.post("/admin/bookings/cancel/handle", data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  },

  getDailyPayoutLogs: async (date) => {
    try {
      const response = await api.get(`payout/logs/${date}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payout logs"
      );
    }
  },

  genarateDailyPayoutLogs: async (date) => {
    try {
      const response = await api.get(`payout/logs/genarate/${date}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payout logs"
      );
    }
  },

  settleDailyPayoutLogs: async (logId, data) => {
    try {
      const response = await api.put(`payout/logs/settle/${logId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payout logs"
      );
    }
  },
};
