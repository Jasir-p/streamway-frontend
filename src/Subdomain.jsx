import { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setEmployeeSubdomain } from "./redux/slice/EmployeeSlice";
import { setUserRoleAndPermissions } from "./redux/slice/authrizeSlice";
import { setProfile } from "./redux/slice/ProfileSlice";
import api from "./api";

const SubdomainContext = createContext(null);
const PUBLIC_WITH_SUBDOMAIN = new Set(["/Streamway/form/", "/signin"]);
const PUBLIC_WITHOUT_SUBDOMAIN = new Set(["/", "/signup", "/otp", "/login"]);

export const SubdomainProvider = ({ children }) => {
  const [state, setState] = useState({
    subdomain: null,
    isLoading: true,
    isValid: false,
    tenantIdentified: false,
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const initializationRef = useRef(false);
  const user_role = useSelector((state) => state.auth.role);

  const isTokenExpired = useCallback((token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }, []);

  const refreshAccessToken = useCallback(async (refreshToken, storedSubdomain) => {
    if (!refreshToken) {
      console.error("No refresh token found");
      return null;
    }

    const refreshEndpoint =
      user_role === "owner"
        ? `https://${storedSubdomain}.streamway.solutions/api/token/refresh/`
        : `https://${storedSubdomain}.streamway.solutions/api/token/employee_refresh/`;

    try {
      const response = await axios.post(refreshEndpoint, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem("access_token", newAccessToken);
      console.log("Access token refreshed");

      const decodedToken = jwtDecode(newAccessToken);
      const role = decodedToken.role;
      const permissions = decodedToken.permissions || [];
      dispatch(setUserRoleAndPermissions({ role, permissions }));

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("subdomain");
      window.location.href = "https://streamway.solutions/login";
      return null;
    }
  }, [dispatch, user_role]);

  const extractSubdomainFromURL = useCallback(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    
    if (parts.length > 2 && parts[0] !== "www") {
      return parts[0];
    }
    return null;
  }, []);

  // Enhanced handleURLParams with better error handling and verification
  const handleURLParams = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access");
    const refreshToken = urlParams.get("refresh");
    const profileParam = urlParams.get("profile");

    if (accessToken && refreshToken && profileParam) {
      try {
        const profile = JSON.parse(profileParam);
        const decodedToken = jwtDecode(accessToken);
        
        // Store tokens and subdomain
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("subdomain", decodedToken.subdomain);
        
        // Wait for localStorage to persist (especially important in production)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify tokens were stored correctly
        const storedAccess = localStorage.getItem("access_token");
        const storedRefresh = localStorage.getItem("refresh_token");
        const storedSubdomain = localStorage.getItem("subdomain");
        
        if (!storedAccess || !storedRefresh || !storedSubdomain) {
          console.error("Failed to store tokens in localStorage");
          throw new Error("LocalStorage failed to persist data");
        }
        
        // Dispatch Redux actions
        dispatch(setProfile({
          id: profile.id,
          name: profile.owner_name,
          email: profile.email,
          phone: profile.contact,
          role: decodedToken.role || 'User',
          company: profile.company || 'Unknown',
          joined_date: profile.created_on,
        }));
        
        dispatch(setUserRoleAndPermissions({
          role: decodedToken.role,
          permissions: decodedToken.permissions || []
        }));

        console.log("URL parameters processed successfully, tokens stored");
        
        // Clean URL after successful processing
        const newUrl = window.location.pathname;
        window.history.replaceState(null, null, newUrl);
        
        return decodedToken.subdomain;
      } catch (error) {
        console.error("Error processing URL parameters:", error);
        // Clean up on error
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("subdomain");
        return null;
      }
    }
    return null;
  }, [dispatch]);

  const validateTenant = useCallback(async (subdomain) => {
    try {
      const tenantResponse = await axios.get(`https://${subdomain}.streamway.solutions/api/`);
      return tenantResponse.data.status;
    } catch (error) {
      console.error("Tenant validation failed:", error);
      return false;
    }
  }, []);

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("subdomain");
    window.location.href = "https://streamway.solutions/login";
  }, []);

  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    try {
      console.log("Initializing authentication...");

      // Handle public routes without subdomain first
      if (PUBLIC_WITHOUT_SUBDOMAIN.has(location.pathname)) {
        setState({
          subdomain: null,
          isLoading: false,
          isValid: false,
          tenantIdentified: false
        });
        return;
      }

      // Handle URL parameters with proper waiting
      const urlSubdomain = await handleURLParams();
      if (urlSubdomain) {
        console.log("URL parameters processed, subdomain:", urlSubdomain);
        // Give more time for localStorage to persist in production
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Get subdomain from storage or URL
      let subdomain = urlSubdomain || localStorage.getItem("subdomain") || extractSubdomainFromURL();

      if (!subdomain) {
        console.log("No subdomain found. Redirecting to login...");
        setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
        redirectToLogin();
        return;
      }

      // Ensure subdomain is stored
      localStorage.setItem("subdomain", subdomain);

      // Handle public routes with subdomain
      if (PUBLIC_WITH_SUBDOMAIN.has(location.pathname)) {
        const isValidTenant = await validateTenant(subdomain);
        if (isValidTenant) {
          setState({
            subdomain,
            isLoading: false,
            isValid: true,
            tenantIdentified: true
          });
          dispatch(setEmployeeSubdomain(subdomain));
        } else {
          setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
          navigate("/", { replace: true });
        }
        return;
      }

      // Check authentication for protected routes
      let accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      console.log("Auth check - AccessToken exists:", !!accessToken);
      console.log("Auth check - RefreshToken exists:", !!refreshToken);

      if (!accessToken || isTokenExpired(accessToken)) {
        if (refreshToken && !isTokenExpired(refreshToken)) {
          console.log("Token expired, attempting to refresh...");
          accessToken = await refreshAccessToken(refreshToken, subdomain);
          
          if (!accessToken) {
            console.log("Token refresh failed, redirecting to login");
            redirectToLogin();
            return;
          }
        } else {
          console.log("No valid refresh token, redirecting to login");
          redirectToLogin();
          return;
        }
      }

      // Validate tenant
      const isValidTenant = await validateTenant(subdomain);
      if (!isValidTenant) {
        console.log("Invalid tenant, redirecting to login");
        setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
        redirectToLogin();
        return;
      }

      // Success - user is authenticated and tenant is valid
      console.log("Authentication successful for subdomain:", subdomain);
      setState({
        subdomain,
        isLoading: false,
        isValid: true,
        tenantIdentified: true
      });

      dispatch(setEmployeeSubdomain(subdomain));

      // Redirect to correct subdomain if needed
      const currentHostname = window.location.hostname;
      const expectedHostname = `${subdomain}.streamway.solutions`;
      
      if (currentHostname !== expectedHostname && !currentHostname.includes('localhost')) {
        console.log("Redirecting to correct subdomain:", expectedHostname);
        window.location.href = `https://${expectedHostname}/dashboard`;
      }

    } catch (error) {
      console.error("Authentication initialization error:", error);
      setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
      redirectToLogin();
    }
  }, [
    location.pathname,
    handleURLParams,
    extractSubdomainFromURL,
    validateTenant,
    isTokenExpired,
    refreshAccessToken,
    redirectToLogin,
    navigate,
    dispatch
  ]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const contextValue = useMemo(() => ({
    subdomain: state.subdomain,
    isLoading: state.isLoading,
    isValid: state.isValid,
    tenantIdentified: state.tenantIdentified
  }), [state]);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <SubdomainContext.Provider value={contextValue}>
      {children}
    </SubdomainContext.Provider>
  );
};

export const useSubdomain = () => {
  const context = useContext(SubdomainContext);
  if (!context) {
    throw new Error("useSubdomain must be used within SubdomainProvider");
  }
  return context;
};