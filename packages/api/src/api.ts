import axios from "axios";
import { toast } from "sonner";
import { ErrorMessages, errorMessagesMap } from "./utils/enums/api.enum";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9100",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let sessionId = localStorage.getItem("_sid");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("_sid", sessionId);
    }
    config.headers["X-Session-ID"] = sessionId;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message as ErrorMessages;

    if (message !== ErrorMessages.UnauthorizedError) {
      toast.error(errorMessagesMap[message] ?? "Internal server error");
    }

    return Promise.reject(error);
  },
);
