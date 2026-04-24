import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSupportSocket = (): Socket => {
  if (socket) return socket;
  const rawUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:9100";
  const baseURL = rawUrl.startsWith("http") ? new URL(rawUrl).origin : rawUrl;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("st") : null;
  socket = io(baseURL, {
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket", "polling"],
    auth: token ? { token } : undefined,
  });
  return socket;
};

export const closeSupportSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const reconnectSupportSocket = () => {
  closeSupportSocket();
  return getSupportSocket();
};
