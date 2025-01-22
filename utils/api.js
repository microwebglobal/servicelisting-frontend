import axios from "axios";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (error.response?.status === 401) {
      toast({
        title: "Error",
        description: "Session expired. Please log in again!",
        variant: "destructive",
      });

      console.log(user);

      if (user.role === "admin") {
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/login/admin";
        }, 3000);
      }
    }

    if (error.response?.status === 403) {
      toast({
        title: "Error",
        description: "Insufficient permissions. Please log in again!",
        variant: "destructive",
      });

      localStorage.removeItem("user");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
    return Promise.reject(error);
  }
);
