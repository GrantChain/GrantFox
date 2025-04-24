import axios from "axios";

export const httpTW = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 60000, // 1 minute
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  },
});

export const http = axios.create({
  baseURL: "/api",
  timeout: 60000, // 1 minute
  headers: {
    "Content-Type": "application/json",
  },
});
