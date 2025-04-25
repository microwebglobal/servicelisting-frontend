import { api } from "../utils/api";

export const providerAPI = {
  //service perovider inquiry
  getEnquiry: () => api.get("/enquiry"),
  getEnquiryById: (inquiryId) => api.get(`/enquiry/${inquiryId}`),
  createEnquiry: (data) => api.post("/enquiry", data),
  approveEnquiry: (inquiryId) => api.put(`/enquiry/${inquiryId}/approve`),
  rejectEnquiry: (inquiryId, data) =>
    api.put(`/enquiry/${inquiryId}/reject`, data),
  deleteEnquiry: (inquiryId) => api.delete(`/enquiry/${inquiryId}`),

  // Service Provider Registration
  registerProvider: (data) =>
    api.post("/provider/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getProvider: (id) => api.get(`/provider/${id}`),
  getProviderByToken: (token) => api.get(`/provider/token/${token}`),
  updateProvider: (id, data) => api.put(`/provider/${id}`, data),
  updateProviderProfile: (id, data) => api.put(`/provider/update/${id}`, data),
  deleteProvider: (id) => api.delete(`/provider/${id}`),
  getProviders: () => api.get("/providers"),
  getProviderByUserId: (userId) => api.get(`/provider/user/${userId}`),

  // Service Provider Password
  setProviderPassword: (data, id) => api.put(`/provider/password/${id}`, data),

  // Service Provider Bookings
  getProviderBookings: (id) => api.get(`/provider/bookings/${id}`),
  acceptProviderBookings: (bookingId, data) =>
    api.put(`/booking/acceptence/${bookingId}`, data),
  sendBookingStartOtp: (data) => api.post("/booking/send-otp", data),
  bookingStartVerify: (data) => api.post("/booking/verify-otp", data),
  stopOngoingBooking: (data) => api.post(`/booking/stop/`, data),
  stopOngoingBookingVerify: (data) =>
    api.post("/booking/stop/verify-otp", data),
  sendBookingEditOtp: (data) => api.post("/booking/edit/send-otp", data),
  bookingEditVerify: (data) => api.post("/booking/edit/verify-otp", data),
  getProviderBookingPayments: (id) => api.get(`/booking/${id}/payment`),
  getProviderEmployeeBookingPayments: (id) =>
    api.get(`/booking/${id}/payment/employee`),
  collectBookingPayment: (id, data) =>
    api.put(`/booking/${id}/payment/collect`, data),
  getProviderBookingPaymentsHistory: (id) =>
    api.get(`/booking/${id}/payment/history`),
  getProviderEmployeeBookingPaymentsHistory: (id) =>
    api.get(`/booking/${id}/payment/history/employee`),

  // Service Provider Employee
  getProviderEmployees: (providerId) =>
    api.get(`/providers/${providerId}/employees`),
  updateProviderEmployees: (employeeId, data) =>
    api.put(`/providers/${employeeId}/employees`, data),
  addProviderEmployees: (providerId, data) =>
    api.post(`/providers/${providerId}/employees`, data),
  updateProviderAvailability: (providerId, data) =>
    api.put(`/provider/availability/${providerId}`, data),
  getEmployeeByUserId: () => api.get(`/user/employee`),
  getEmployeeBookings: (employeeId) =>
    api.get(`/employee/bookings/${employeeId}`),
  getAvailableEmployees: (
    providerId,
    booking_id,
    bookingDate,
    startTime,
    endTime
  ) =>
    api.get(`/available/${providerId}/employees`, {
      params: {
        booking_id,
        bookingDate,
        start_time: startTime,
        end_time: endTime,
      },
    }),

  //service provider categories
  updateProviderCategory: (providerId, data) =>
    api.put(`/providers/${providerId}/categories`, data),

  //service provider documents
  approveProviderDocument: (documentId) =>
    api.put(`/provider/doc/approve/${documentId}`),

  rejectProviderDocument: (documentId) =>
    api.put(`/provider/doc/reject/${documentId}`),
};
