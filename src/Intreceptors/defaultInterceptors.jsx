import axios from 'axios';

const getDefaultBaseUrl = () => {
    return import.meta.env.VITE_API_URL;
    };

const defaultInterceptor = axios.create ({
    baseURL: getDefaultBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        },
        })

defaultInterceptor.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            }
            return config;

    },
    (error) => {
        return Promise.reject(error);
        }

)

defaultInterceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for unauthorized status and prevent multiple retry attempts
        if (
            error.response?.status === 401 && 
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                if (!refreshToken) {
                    console.error('No refresh token available');
                    return handleAuthenticationFailure();
                }
                
                const refreshResponse = await axios.post(
                    `${getDefaultBaseUrl()}api/token/refresh/`, 
                    { refresh: refreshToken }
                );

                if (refreshResponse?.data?.access) {
                    const newAccessToken = refreshResponse.data.access;

                    localStorage.setItem("access_token", newAccessToken);
  
                    defaultInterceptor.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return defaultInterceptor(originalRequest);
                }

                throw new Error("Token refresh failed: No access token");
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError);
                return handleAuthenticationFailure();
            }
        }
        
        return Promise.reject(error);
    }
);


const handleAuthenticationFailure = () => {
     const isAdminRoute = window.location.pathname.startsWith('/admin');
    localStorage.clear();
    const loginPath = (isAdminRoute) ? '/admin/login' : '/login';
    window.location.href = loginPath;
    return Promise.reject(new Error("Authentication failed"));
};


export const updateDefaultBaseUrl = () => {
    const newBaseUrl = getDefaultBaseUrl();
    defaultInterceptor.defaults.baseURL = newBaseUrl;
    return newBaseUrl;
};

export default defaultInterceptor;
              

