import axios from "axios";
import { toast } from "sonner";
import { ErrorMessages, errorMessagesMap } from "./utils/enums/api.enum";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9100",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message as ErrorMessages;

    toast.error(errorMessagesMap[message]);

    if (message === ErrorMessages.UnauthorizedError) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
