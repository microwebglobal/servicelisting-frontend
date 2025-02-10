import { api } from "../utils/api";

export const providerAPI = {
  //service perovider inquiry
  getEnquiry: () => api.get("/enquiry"),
  getEnquiryById: (inquiryId) => api.get(`/enquiry/${inquiryId}`),
  createEnquiry: (data) => api.post("/enquiry", data),
  approveEnquiry: (inquiryId) => api.put(`/enquiry/${inquiryId}/approve`),
  rejectEnquiry: (inquiryId) => api.put(`/enquiry/${inquiryId}/reject`),

  // Service Provider Registration
  registerProvider: (data) =>
    api.post("/provider/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getProvider: (id) => api.get(`/provider/${id}`),
  updateProvider: (id, data) => api.put(`/provider/${id}`, data),
  updateProviderProfile: (id, data) => api.put(`/provider/update/${id}`, data),
  deleteProvider: (id) => api.delete(`/provider/${id}`),
  getProviders: () => api.get("/providers"),
  getProviderByUserId: (userId) => api.get(`/provider/user/${userId}`),

  // Service Provider Password
  setProviderPassword: (data, id) => api.put(`/provider/password/${id}`, data),

  // Service Provider Bookings
  getProviderBookings: (id) => api.get(`/provider/bookings/${id}`),

  // Service Provider Employee
  getProviderEmployees: (providerId) =>
    api.get(`/providers/${providerId}/employees`),
  updateProviderEmployees: (employeeId, data) =>
    api.put(`/providers/${employeeId}/employees`, data),
  addProviderEmployees: (providerId, data) =>
    api.post(`/providers/${providerId}/employees`, data),
  updateProviderAvailability: (providerId, data) =>
    api.put(`/provider/availability/${providerId}`, data),
};
