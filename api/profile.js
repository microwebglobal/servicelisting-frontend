import { api } from "../utils/api";

export const profileAPI = {
  // User Profile
  getAllCustomers: () => api.get("/customers/all"),
  updateCustomerProfileStatus: (id, data) =>
    api.put(`/customer/status/${id}`, data),
  getProfileByUserId: (id) => api.get(`/customer-profiles/user/${id}`),
  updateProfile: (data, id) => api.put(`/users/profile/${id}`, data),
  uploadPhoto: (formData) =>
    api.post("/users/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sendEmailValidation: (id) => api.get(`/users/send-emailvalidate/${id}`),
  validateEmail: (id) => api.put(`/users/validate-email/${id}`),

  // User Addresses
  getAddresses: () => api.get("/users/addresses"),
  getAddressById: (addressId) => api.get(`/users/addresses/${addressId}`),
  createAddress: (data) => api.post("/users/addresses", data),
  updateAddress: (addressId, data) =>
    api.put(`/users/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
  setPrimaryAddress: (addressId) =>
    api.put(`/users/addresses/${addressId}/primary`),
  getAddressBelongsToCity: (city) => api.get(`/users/city/${city}/addresses`),

  // User Settings
  updateSettings: (data) => api.put("/users/settings", data),
  getSettings: () => api.get("/users/settings"),

  // User Account
  changePassword: (data) => api.put("/users/password", data),
  deactivateAccount: () => api.put("/users/deactivate"),
  deleteAccount: () => api.delete("/users/account"),
  getAccBalance: () => api.get("/payout/acc-balance"),
  settleProviderAccBalance: () => api.put("/payout/acc-balance/settle"),

  //User Notifications
  getUserNotifications: () => api.get("/notification/"),
  readNotification: (id) => api.put(`/notification/${id}/read`),
  readAllNotifications: () => api.put(`/notification/read-all`),
  deleteNotification: (id) => api.delete(`/notification/${id}`),
  deleteAllNotifications: () => api.delete(`/notification/delete-all`),
  filterNotifications: (params) => api.get("/notification/filter", { params }),
};
