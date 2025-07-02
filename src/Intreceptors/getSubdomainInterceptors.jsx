import axios from "axios";

// Helper function to wait for subdomain to be available
const waitForSubdomain = (maxWaitTime = 3000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkSubdomain = () => {
      const subdomain = localStorage.getItem("subdomain");
      
      if (subdomain) {
        console.log("Subdomain found:", subdomain);
        resolve(subdomain);
        return;
      }
      
      // Check if we've exceeded max wait time
      if (Date.now() - startTime > maxWaitTime) {
        console.warn("Timeout waiting for subdomain");
        reject(new Error("Subdomain not found within timeout period"));
        return;
      }
      
      // Check again in 100ms
      setTimeout(checkSubdomain, 100);
    };
    
    checkSubdomain();
  });
};

const getSubdomainBaseUrl = async (forceWait = false) => {
    let subdomain = localStorage.getItem("subdomain");
    
    // If no subdomain and we're forcing wait (for critical requests)
    if (!subdomain && forceWait) {
        try {
            subdomain = await waitForSubdomain();
        } catch (error) {
            console.error("Failed to get subdomain:", error);
        }
    }
    
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

// Initialize with a placeholder - will be updated dynamically
const subdomainInterceptors = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    headers: {
        "Content-Type": "application/json",
    },
});

subdomainInterceptors.interceptors.request.use(
    async (config) => {
        // Check URL params first (for initial requests after login redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const accessTokenFromUrl = urlParams.get("access");
        
        let token = localStorage.getItem("access_token") || accessTokenFromUrl;
        let subdomain = localStorage.getItem("subdomain");
        
        // If no subdomain but we have URL params, try to decode from URL token
        if (!subdomain && accessTokenFromUrl) {
            try {
                const { jwtDecode } = await import("jwt-decode");
                const decodedToken = jwtDecode(accessTokenFromUrl);
                subdomain = decodedToken.subdomain;
                console.log("Got subdomain from URL token:", subdomain);
            } catch (error) {
                console.error("Error decoding URL token:", error);
            }
        }
        
        // For critical API calls, wait for subdomain if not available
        const isCriticalRoute = config.url?.includes('/api/tenant') || 
                              config.url?.includes('/dashboard') ||
                              config.url?.includes('/profile');
        
        if (!subdomain && isCriticalRoute) {
            try {
                console.log("Waiting for subdomain for critical route:", config.url);
                subdomain = await waitForSubdomain(2000); // Wait up to 2 seconds
            } catch (error) {
                console.error("Critical route failed - no subdomain:", config.url);
                // Don't proceed with the request if it's critical and no subdomain
                return Promise.reject(new Error("Subdomain required for this request"));
            }
        }

        // Set authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Set the correct base URL
        if (subdomain) {
            const newBaseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
            config.baseURL = newBaseUrl;
            console.log("Request using subdomain URL:", newBaseUrl);
        } else {
            config.baseURL = import.meta.env.VITE_API_URL;
            console.warn("Request using default API URL (no subdomain)");
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
                let subdomain = localStorage.getItem("subdomain");
                
                // Try to get subdomain from URL if not in localStorage
                if (!subdomain) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const accessTokenFromUrl = urlParams.get("access");
                    
                    if (accessTokenFromUrl) {
                        try {
                            const { jwtDecode } = await import("jwt-decode");
                            const decodedToken = jwtDecode(accessTokenFromUrl);
                            subdomain = decodedToken.subdomain;
                        } catch (decodeError) {
                            console.error("Error decoding URL token in response interceptor:", decodeError);
                        }
                    }
                }

                if (!refreshToken || !subdomain) {
                    console.error("Missing refresh token or subdomain", { 
                        hasRefresh: !!refreshToken, 
                        subdomain: subdomain 
                    });
                    localStorage.clear();
                    window.location.href = "https://streamway.solutions/login";
                    return Promise.reject(error);
                }

                const baseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
                const refreshResponse = await axios.post(
                    `${baseUrl}/api/token/refresh/`,
                    { refresh: refreshToken }
                );

                if (refreshResponse.data.access) {
                    const newAccessToken = refreshResponse.data.access;
                    localStorage.setItem("access_token", newAccessToken);

                    // Update the original request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.baseURL = baseUrl;

                    return subdomainInterceptors(originalRequest);
                }

                console.error("Refresh response did not contain an access token");
                localStorage.clear();
                window.location.href = "https://streamway.solutions/login";
                return Promise.reject(new Error("Token refresh failed"));

            } catch (refreshError) {
                console.error("Token refresh error:", refreshError);
                localStorage.clear();
                window.location.href = "https://streamway.solutions/login";
                return Promise.reject(refreshError);
            }
        }

        // If it's a subdomain-related error, try to redirect properly
        if (error.response?.status === 404 && error.config?.baseURL?.includes('streamway.solutions')) {
            console.error("Subdomain API endpoint not found:", error.config.baseURL);
        }

        return Promise.reject(error);
    }
);

// Function to manually update base URL when subdomain is confirmed
export const updateSubdomainBaseUrl = () => {
    const subdomain = localStorage.getItem("subdomain");
    if (subdomain) {
        const newBaseUrl = import.meta.env.VITE_API_SUBDOMAIN_URL.replace("{subdomain}", subdomain);
        subdomainInterceptors.defaults.baseURL = newBaseUrl;
        console.log("Updated interceptor base URL:", newBaseUrl);
        return newBaseUrl;
    }
    return null;
};

// Export a ready promise that resolves when subdomain is available
export const subdomainReady = () => waitForSubdomain();

export default subdomainInterceptors;