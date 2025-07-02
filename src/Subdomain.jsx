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

  // IMMEDIATE URL processing - runs synchronously on module load
  const processURLParamsImmediately = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access");
    const refreshToken = urlParams.get("refresh");
    const profileParam = urlParams.get("profile");

    if (accessToken && refreshToken && profileParam) {
      console.log("Processing URL params immediately...");
      
      try {
        const profile = JSON.parse(profileParam);
        const decodedToken = jwtDecode(accessToken);
        
        // Store tokens and subdomain IMMEDIATELY
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("subdomain", decodedToken.subdomain);
        
        console.log("Tokens stored immediately:", {
          subdomain: decodedToken.subdomain,
          hasAccess: !!accessToken,
          hasRefresh: !!refreshToken
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
        
        // Clean URL
        window.history.replaceState(null, null, window.location.pathname);
        
        return decodedToken.subdomain;
      } catch (error) {
        console.error("Error processing URL parameters immediately:", error);
        return null;
      }
    }
    return null;
  }, [dispatch]);

  // Process URL params immediately when component mounts
  useEffect(() => {
    const urlSubdomain = processURLParamsImmediately();
    if (urlSubdomain) {
      console.log("URL subdomain processed immediately:", urlSubdomain);
    }
  }, []); // Run only once on mount

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

      // Get subdomain (should already be processed from URL params)
      let subdomain = localStorage.getItem("subdomain") || extractSubdomainFromURL();

      if (!subdomain) {
        console.log("No subdomain found. Redirecting to login...");
        setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
        redirectToLogin();
        return;
      }

      console.log("Using subdomain:", subdomain);

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

      console.log("Auth check:", {
        hasAccess: !!accessToken,
        hasRefresh: !!refreshToken,
        subdomain: subdomain
      });

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
    extractSubdomainFromURL,
    validateTenant,
    isTokenExpired,
    refreshAccessToken,
    redirectToLogin,
    navigate,
    dispatch
  ]);

  useEffect(() => {
    // Small delay to ensure URL params are processed first
    const timer = setTimeout(() => {
      initializeAuth();
    }, 100);
    
    return () => clearTimeout(timer);
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