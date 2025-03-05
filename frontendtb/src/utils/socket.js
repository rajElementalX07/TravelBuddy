import io from "socket.io-client";

export const createSocketConnection = () => {
  if (window.location.hostname === "localhost") {
    return io("http://localhost:7000");
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};