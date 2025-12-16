// lib/api/client.ts - UPDATED WITH BETTER LOGGING
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Increased timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          `🔑 API Request [${config.method?.toUpperCase()} ${
            config.url
          }]: Token attached`
        );
      } else {
        console.warn(
          `⚠️ API Request [${config.method?.toUpperCase()} ${
            config.url
          }]: No auth token`
        );
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - returns data directly
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ API Success [${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}]`
    );

    // Return the data property if it exists, otherwise return the full response
    return response.data;
  },
  (error) => {
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data,
      requestData: error.config?.data,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
    };
    
    console.error(
      `❌ API Error [${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }]:`,
      errorDetails
    );
    
    // Log the full error for debugging
    if (error.response?.data) {
      console.error('Backend error response:', JSON.stringify(error.response.data, null, 2));
    }

    // Handle errors
    if (error.response?.status === 401) {
      console.log("🔒 401 Unauthorized - Clearing auth tokens");
      // Clear token and redirect to login (client side only)
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }

    if (error.response?.status === 403) {
      console.log("🚫 403 Forbidden - Insufficient permissions");
      console.log("Endpoint:", error.config?.url);
      console.log("User role may not have access to this endpoint");
    }

    // Extract error message - handle validation errors
    let errorMessage = error.message || `HTTP ${error.response?.status || "Unknown"} error`;
    
    if (error.response?.data) {
      // Handle validation errors (array of messages)
      if (Array.isArray(error.response.data.message)) {
        errorMessage = error.response.data.message.join(', ');
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
