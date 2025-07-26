import axios from "axios";
import { jwtDecode } from "jwt-decode";
import store from "../redux/store";// ✅ adjust path if needed

// Utility: extract subdomain from token
const getSubdomainFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.subdomain || decoded.tenant || null;
  } catch {
    return null;
  }
};

// Utility: get tokens and subdomain (from localStorage or token)
const getAuthContext = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessFromUrl = urlParams.get("access");

  const accessToken = localStorage.getItem("access_token") || accessFromUrl;
  const refreshToken = localStorage.getItem("refresh_token");

  let subdomain = localStorage.getItem("subdomain");

  if (!subdomain && accessToken) {
    subdomain = getSubdomainFromToken(accessToken);
    if (subdomain) localStorage.setItem("subdomain", subdomain); // ✅ persist it
  }

  return { accessToken, refreshToken, subdomain };
};

// Axios instance
const subdomainAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
subdomainAxios.interceptors.request.use(
  (config) => {
    const { accessToken, subdomain } = getAuthContext();

    if (!subdomain) {
      return Promise.reject(new Error("Subdomain is required"));
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.baseURL = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Token Refresh Logic)
subdomainAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, subdomain } = getAuthContext();
      const role = store.getState().auth.role;

      if (!refreshToken || !subdomain) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const baseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
        const refreshUrl =
          role === "owner"
            ? `${baseUrl}/api/token/refresh/`
            : `${baseUrl}/api/token/employee_refresh/`;

        const res = await axios.post(refreshUrl, { refresh: refreshToken });

        if (res.data?.access) {
          localStorage.setItem("access_token", res.data.access);

          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          originalRequest.baseURL = baseUrl;

          return subdomainAxios(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

// Update baseURL manually (optional)
export const updateSubdomainBaseUrl = () => {
  const { subdomain } = getAuthContext();
  if (subdomain) {
    const baseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
    subdomainAxios.defaults.baseURL = baseUrl;
    return baseUrl;
  }
  return null;
};

export default subdomainAxios;
