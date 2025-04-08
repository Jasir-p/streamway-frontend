import axios from "axios";
import store  from "./redux/store"; // Add this import to access Redux store


const getApiBaseUrl = () => {
  const subdomain = localStorage.getItem("subdomain");
  
  let baseUrl;
  if (subdomain) {
    baseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
  } else {
    baseUrl = import.meta.env.VITE_API_URL;
  }

  // if (!baseUrl.endsWith('/')) {
  //   baseUrl += '/';
  // }
  
  console.log("Using base URL:", baseUrl);
  return baseUrl;
};


export const updateApiBaseUrl = () => {
  const baseURL = getApiBaseUrl();
  api.defaults.baseURL = baseURL;
  console.log("Updated API base URL:", baseURL);
  return baseURL;
};

// Create axios instance
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to an unauthorized request and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Attempting to refresh token...");

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const subdomain = localStorage.getItem("subdomain");

        if (!refreshToken || !subdomain) {
          console.error("Missing refresh token or subdomain");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Make sure store is imported and accessible
        const userRole = store?.getState()?.auth?.role || "unknown";
        console.log("User role for refresh:", userRole);

        // Create a separate axios instance just for token refresh to avoid interceptor loops
        const refreshAxios = axios.create({
          baseURL: getApiBaseUrl(),
          headers: { "Content-Type": "application/json" }
        });

        // Use relative paths with the base URL instead of hardcoded URLs
        const refreshEndpoint = userRole === "owner"
          ? "/api/token/refresh/"
          : "/api/token/employee_refresh/";

        console.log("Calling refresh endpoint:", refreshEndpoint);
        const response = await refreshAxios.post(refreshEndpoint, {
          refresh: refreshToken
        });
        console.log("Refresh response:", response.data);

        if (response.data.access) {

          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);

          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          console.log("Token refreshed successfully, retrying original request");

          return api(originalRequest);
        } else {
          console.error("Refresh response did not contain an access token");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(new Error("Token refresh failed"));
        }
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        console.error("Token refresh error details:", refreshError.response?.data);
        

        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;