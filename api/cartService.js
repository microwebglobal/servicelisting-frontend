// cartService.js
import { api } from "../utils/api";
import { format } from "date-fns";

export const cartService = {
  addToCart: async (cartData) => {
    try {
      const formattedDate = format(
        new Date(cartData.bookingDate),
        "yyyy-MM-dd"
      );
      const defaultLocation = {
        type: "Point",
        coordinates: [0, 0],
      };

      const formattedData = {
        cityId: cartData.cityId,
        items: cartData.items.map((item) => ({
          itemId: item.id,
          duration_hours: item.duration_hours,
          duration_minutes: item.duration_minutes,
          itemType:
            item.type === "package_item" ? "package_item" : "service_item",
          quantity: item.quantity || 1,
        })),
        bookingDate: formattedDate,
        startTime: cartData.startTime,
        serviceAddress: cartData.serviceAddress || "",
        serviceLocation: cartData.coordinates || defaultLocation,
        customerNotes: cartData.customerNotes || "",
      };

      const response = await api.post("/cart/add", formattedData);
      return response.data;
    } catch (error) {
      console.error("Cart Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to add to cart");
    }
  },

  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch cart");
    }
  },

  updateCartItem: async (itemData) => {
    try {
      const response = await api.put("/cart/item", {
        itemId: itemData.itemId,
        quantity: itemData.quantity,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  },

  updateTip: async (tipData) => {
    try {
      const response = await api.put("/cart/tip", {
        tipAmount: tipData.tipAmount,
        subTotal: tipData.subTotal,
        taxAmount: tipData.taxAmount,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update tip");
    }
  },

  proceedToCheckout: async () => {
    try {
      const response = await api.post("/cart/checkout");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to proceed to checkout"
      );
    }
  },

  proceedPayment: async (paymentData) => {
    try {
      const response = await api.post("/book/payment", {
        bookingId: paymentData.bookingId,
        paymentType: paymentData.paymentType,
        paymentMethod: paymentData.paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Payment processing failed"
      );
    }
  },

  getBooking: async (bookingId) => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  },

  completeCashPayment: async (bookingId) => {
    try {
      const response = await api.post(
        `/booking/${bookingId}/complete-cash-payment`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to complete cash payment"
      );
    }
  },

  getCustomerBookings: async () => {
    try {
      const response = await api.get("/customer/booking");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch customer bookings"
      );
    }
  },

  cancellBookingByCustomer: async (bookingId) => {
    try {
      const response = await api.get(`/booking/cancel/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  },

  confirmCancellBookingByCustomer: async (bookingId, data) => {
    try {
      const response = await api.put(
        `/booking/cancel/confirm/${bookingId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  },
};
