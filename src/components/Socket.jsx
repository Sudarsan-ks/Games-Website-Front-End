import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SERVER_URL, {
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.warn("❌ Disconnected:", reason);
});

socket.on("connect_error", (err) => {
    console.error("⚠️ Connection Error:", err.message);
});
