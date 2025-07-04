import axios from "axios";

// Wait until `subdomain` is set in localStorage
const waitForSubdomain = (maxWaitTime = 3000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const subdomain = localStorage.getItem("subdomain");
      if (subdomain) {
        console.log("✅ Subdomain found:", subdomain);
        resolve(subdomain);
        return;
      }
      if (Date.now() - startTime > maxWaitTime) {
        console.warn("⏱️ Timeout waiting for subdomain");
        reject(new Error("Subdomain not found within timeout period"));
        return;
      }
      setTimeout(check, 100);
    };

    check();
  });
};

const subdomainInterceptors = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

subdomainInterceptors.interceptors.request.use(
  async (config) => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenFromUrl = urlParams.get("access");

    let token = localStorage.getItem("access_token") || accessTokenFromUrl;
    let subdomain = localStorage.getItem("subdomain");

    // Extract subdomain from token if not in localStorage
    if (!subdomain && accessTokenFromUrl) {
      try {
        const { jwtDecode } = await import("jwt-decode");
        const decoded = jwtDecode(accessTokenFromUrl);
        subdomain = decoded.subdomain || decoded.tenant;
        console.log("🔓 Got subdomain from token:", subdomain);
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    }

    // Wait for subdomain if not available
    if (!subdomain) {
      try {
        console.log("⏳ Waiting for subdomain...");
        subdomain = await waitForSubdomain(2000);
      } catch (err) {
        console.error("❌ Subdomain required for request");
        return Promise.reject(new Error("Subdomain required for this request"));
      }
    }

    // Set authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set subdomain-based baseURL
    const subdomainBaseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
    config.baseURL = subdomainBaseUrl;
    console.log("🌐 Using subdomain URL:", subdomainBaseUrl);

    return config;
  },
  (err) => Promise.reject(err)
);

subdomainInterceptors.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        let subdomain = localStorage.getItem("subdomain");

        // Extract subdomain from URL token if not in localStorage
        if (!subdomain) {
          const accessTokenFromUrl = new URLSearchParams(window.location.search).get("access");
          if (accessTokenFromUrl) {
            try {
              const { jwtDecode } = await import("jwt-decode");
              const decoded = jwtDecode(accessTokenFromUrl);
              subdomain = decoded.subdomain || decoded.tenant;
            } catch (decodeError) {
              console.error("❌ Error decoding token in response interceptor:", decodeError);
            }
          }
        }

        if (!refreshToken || !subdomain) {
          console.error("⚠️ Missing refresh token or subdomain. Logging out.");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }

        const baseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
        const refreshResponse = await axios.post(`${baseUrl}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        if (refreshResponse.data.access) {
          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem("access_token", newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.baseURL = baseUrl;

          return subdomainInterceptors(originalRequest);
        }

        console.error("❌ Refresh response did not return new access token.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(new Error("Token refresh failed"));
      } catch (refreshError) {
        console.error("❌ Token refresh error:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

// Manual baseURL update
export const updateSubdomainBaseUrl = () => {
  const subdomain = localStorage.getItem("subdomain");
  if (subdomain) {
    const newBaseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
    subdomainInterceptors.defaults.baseURL = newBaseUrl;
    console.log("✅ Interceptor base URL updated:", newBaseUrl);
    return newBaseUrl;
  }
  return null;
};

// Utility for waiting for subdomain
export const subdomainReady = () => waitForSubdomain();

export default subdomainInterceptors;