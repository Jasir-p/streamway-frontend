import axios from "axios";

const getSubdomainBaseUrl = () => {
    const subdomain = localStorage.getItem("subdomain");
    console.log("Current subdomain:", subdomain);

    if (!subdomain) {
        console.warn("No subdomain found. Falling back to default API URL.");
        return import.meta.env.VITE_API_URL || '';
    }

    try {
        return import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
    } catch (error) {
        console.error("Error generating subdomain URL:", error);
        return import.meta.env.VITE_API_URL || '';
    }
};

const subdomainInterceptors = axios.create({
    baseURL: getSubdomainBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

subdomainInterceptors.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      const subdomain = localStorage.getItem("subdomain");
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      // Ensure the subdomain is applied dynamically
      if (subdomain) {
        config.baseURL = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
      } else {
        config.baseURL = import.meta.env.VITE_API_URL;
        console.warn("No subdomain found. Using default API URL.");
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
  

subdomainInterceptors.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const subdomain = localStorage.getItem("subdomain");

                if (!refreshToken || !subdomain) {
                    console.error("Missing refresh token or subdomain");
                    localStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                const refreshResponse = await axios.post(
                    `${getSubdomainBaseUrl()}/api/token/refresh/`,
                    { refresh: refreshToken }
                );

                if (refreshResponse.data.access) {
                    const newAccessToken = refreshResponse.data.access;
                    localStorage.setItem("access_token", newAccessToken);

                    subdomainInterceptors.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return subdomainInterceptors(originalRequest);
                }

                console.error("Refresh response did not contain an access token");
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(new Error("Token refresh failed"));

            } catch (refreshError) {
                console.error("Token refresh error:", refreshError);
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const updateSubdomainBaseUrl = () => {
    const newBaseUrl = getSubdomainBaseUrl();
    subdomainInterceptors.defaults.baseURL = newBaseUrl;
    return newBaseUrl;
};

export default subdomainInterceptors;
