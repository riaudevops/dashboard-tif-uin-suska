import axios from "axios";
import { accessToken } from "@/helpers/get-token.helper";

export const api = () =>{
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000, // Timeout 5 detik
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken()}`,
    },
  });
  return axiosInstance;
}