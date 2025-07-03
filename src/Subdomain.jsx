import { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setEmployeeSubdomain } from "./redux/slice/EmployeeSlice";
import { setUserRoleAndPermissions } from "./redux/slice/authrizeSlice";
import { setProfile } from "./redux/slice/ProfileSlice";
import { updateSubdomainBaseUrl } from "./Intreceptors/getSubdomainInterceptors";

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
  const urlProcessedRef = useRef(false);
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

  // SYNCHRONOUS URL processing - runs immediately
  const processURLParamsSync = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access");
    const refreshToken = urlParams.get("refresh");
    const profileParam = urlParams.get("profile");

    if (accessToken && refreshToken && profileParam) {
      console.log("🔄 Processing URL params synchronously...");
      
      try {
        const profile = JSON.parse(decodeURIComponent(profileParam));
        const decodedToken = jwtDecode(accessToken);
        
        // Store tokens and subdomain IMMEDIATELY
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("subdomain", decodedToken.subdomain);
        
        console.log("✅ Tokens stored successfully:", {
          subdomain: decodedToken.subdomain,
          hasAccess: !!accessToken,
          hasRefresh: !!refreshToken,
          tokenExp: new Date(decodedToken.exp * 1000).toISOString()
        });
        
        // Update interceptor base URL immediately
        updateSubdomainBaseUrl();
        
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

        dispatch(setEmployeeSubdomain(decodedToken.subdomain));
        
        // Clean URL - remove query parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState(null, null, cleanUrl);
        
        urlProcessedRef.current = true;
        return decodedToken.subdomain;
      } catch (error) {
        console.error("❌ Error processing URL parameters:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("subdomain");
        return null;
      }
    }
    return null;
  }, [dispatch]);

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
      console.log("🔄 Refreshing token...");
      const response = await axios.post(refreshEndpoint, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem("access_token", newAccessToken);
      console.log("✅ Access token refreshed");

      const decodedToken = jwtDecode(newAccessToken);
      const role = decodedToken.role;
      const permissions = decodedToken.permissions || [];
      dispatch(setUserRoleAndPermissions({ role, permissions }));

      return newAccessToken;
    } catch (error) {
      console.error("❌ Failed to refresh token:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("subdomain");
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

  const validateTenant = useCallback(async (subdomain) => {
  try {
    console.log(`🔍 Validating tenant: ${subdomain}`);
    const tenantResponse = await axios.get(`https://${subdomain}.streamway.solutions/api/`);
    console.log("✅ Tenant validation successful");
    return true; // If API responds, tenant is valid
  } catch (error) {
    console.error("❌ Tenant validation failed:", error);
    return false;
  }
}, []);
  const redirectToLogin = useCallback(() => {
    console.log("🔄 Redirecting to login...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("subdomain");
    window.location.href = "https://streamway.solutions/login";
  }, []);

  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    try {
      console.log("🚀 Initializing authentication...");

      // First, process URL parameters if they exist
      const urlSubdomain = processURLParamsSync();
      
      // Handle public routes without subdomain
      if (PUBLIC_WITHOUT_SUBDOMAIN.has(location.pathname)) {
        console.log("📍 Public route without subdomain");
        setState({
          subdomain: null,
          isLoading: false,
          isValid: false,
          tenantIdentified: false
        });
        return;
      }

      // Get subdomain from storage or URL
      let subdomain = localStorage.getItem("subdomain") || urlSubdomain || extractSubdomainFromURL();

      if (!subdomain) {
        console.log("❌ No subdomain found. Redirecting to login...");
        setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
        redirectToLogin();
        return;
      }

      console.log("🏢 Using subdomain:", subdomain);

      // Handle public routes with subdomain
      if (PUBLIC_WITH_SUBDOMAIN.has(location.pathname)) {
        console.log("📍 Public route with subdomain");
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

      console.log("🔐 Auth check:", {
        hasAccess: !!accessToken,
        hasRefresh: !!refreshToken,
        subdomain: subdomain,
        urlProcessed: urlProcessedRef.current
      });

      // If we just processed URL params, tokens should be fresh
      if (urlProcessedRef.current && accessToken) {
        console.log("✅ Fresh tokens from URL processing");
      } else if (!accessToken || isTokenExpired(accessToken)) {
        if (refreshToken && !isTokenExpired(refreshToken)) {
          console.log("🔄 Token expired, attempting to refresh...");
          accessToken = await refreshAccessToken(refreshToken, subdomain);
          
          if (!accessToken) {
            console.log("❌ Token refresh failed, redirecting to login");
            redirectToLogin();
            return;
          }
        } else {
          console.log("❌ No valid tokens, redirecting to login");
          redirectToLogin();
          return;
        }
      }

      // Validate tenant
      const isValidTenant = await validateTenant(subdomain);
      if (!isValidTenant) {
        console.log("❌ Invalid tenant, redirecting to login");
        setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
        redirectToLogin();
        return;
      }

      // Success - user is authenticated and tenant is valid
      console.log("🎉 Authentication successful for subdomain:", subdomain);
      setState({
        subdomain,
        isLoading: false,
        isValid: true,
        tenantIdentified: true
      });

      dispatch(setEmployeeSubdomain(subdomain));

      // Redirect to correct subdomain if needed (only for production)
      const currentHostname = window.location.hostname;
      const expectedHostname = `${subdomain}.streamway.solutions`;
      
      if (currentHostname !== expectedHostname && 
          !currentHostname.includes('localhost') && 
          !currentHostname.includes('127.0.0.1')) {
        console.log("🔄 Redirecting to correct subdomain:", expectedHostname);
        window.location.href = `https://${expectedHostname}/dashboard`;
      }

    } catch (error) {
      console.error("❌ Authentication initialization error:", error);
      setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
      redirectToLogin();
    }
  }, [
    location.pathname,
    processURLParamsSync,
    extractSubdomainFromURL,
    validateTenant,
    isTokenExpired,
    refreshAccessToken,
    redirectToLogin,
    navigate,
    dispatch
  ]);

  // Initialize immediately when component mounts
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Re-initialize when location changes (for navigation)
  useEffect(() => {
    if (!initializationRef.current) return;
    
    // Reset initialization flag for new route
    initializationRef.current = false;
    urlProcessedRef.current = false;
    
    // Small delay to allow for any pending operations
    const timer = setTimeout(() => {
      initializeAuth();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const contextValue = useMemo(() => ({
    subdomain: state.subdomain,
    isLoading: state.isLoading,
    isValid: state.isValid,
    tenantIdentified: state.tenantIdentified
  }), [state]);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
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