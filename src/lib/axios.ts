import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 60000, // 1 minute
  headers: {
    "Content-Type": "application/json",
  },
});
