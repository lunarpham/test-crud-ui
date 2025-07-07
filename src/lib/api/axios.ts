import axios from "axios";
import { Constants } from "../constants";

const axiosInstance = axios.create({
  baseURL: Constants.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Either refresh token or logout user
      localStorage.removeItem("auth_token");
      window.location.href = Constants.Routes.LOGIN();
    }

    return Promise.reject(error);
  }
);
