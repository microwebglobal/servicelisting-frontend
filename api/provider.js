import { api } from "../utils/api";

export const providerAPI = {
  //service perovider inquiry
  getEnquiry: () => api.get("/enquiry"),
  getEnquiryById: (inquiryId) => api.get(`/enquiry/${inquiryId}`),
  createEnquiry: (data) => api.post("/enquiry", data),
  approveEnquiry: (inquiryId) => api.put(`/enquiry/${inquiryId}/approve`),
  rejectEnquiry: (inquiryId) => api.put(`/enquiry/${inquiryId}/reject`),


  // Service Provider Registration
  registerProvider: (data) => api.post("/provider/register", data),
  getProvider: (id) => api.get(`/provider/${id}`),
  updateProvider: (id, data) => api.put(`/provider/${id}`, data),
  deleteProvider: (id) => api.delete(`/provider/${id}`),
  getProviders: () => api.get("/providers"),
  getProviderByUserId: (userId) => api.get(`/provider/user/${userId}`),

};
