import { api } from "../utils/api";

export const providerAPI = {
  //service perovider inquiry
  getEnquiry: () => api.get("/enquiry"),
  getEnquiryById: (inquiryId) => api.get(`/enquiry/${inquiryId}`),
  createEnquiry: (data) => api.post("/enquiry", data),
  approveEnquiry: (inquiryId) => api.put(`/enquiry/${inquiryId}/approve`),
};
