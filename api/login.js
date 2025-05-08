import { api } from "../utils/api";

export const LoginAPI = {
  // Customer OTP login
  customerLoginSendOTP: (mobile, method) =>
    api.post("/auth/customer/login/send-otp", { mobile, method }),

  customerLoginVerifyOTP: (mobile, otp) =>
    api.post("/auth/customer/login/verify-otp", { mobile, otp }),

  // Admin login
  adminLogin: (email, password) =>
    api.post("/auth/admin/login", { email, password }),

  // Service Provider login
  providerLogin: (email, password) =>
    api.post("/auth/provider/login", { email, password }),

  // Common logout
  logout: () => api.post("/auth/logout"),
};
