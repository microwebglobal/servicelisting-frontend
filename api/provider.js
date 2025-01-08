import { api } from "../utils/api";

export const providerAPI = {
  //service perovider inquiry
  getEnquiry: () => api.get("/enquiry"),
  createEnquiry: (data) => api.post("/enquiry", data),
};
