import { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setEmployeeSubdomain } from "./redux/slice/EmployeeSlice";
import { setUserRoleAndPermissions } from "./redux/slice/authrizeSlice";
import { useSelector } from "react-redux";
import api from "./api";
import { setProfile } from "./redux/slice/ProfileSlice";


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
  const hasRun = useRef(false); 
  const user_role=useSelector((state)=>state.auth.role)

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now(); 
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; 
    }
  };

  const refreshAccessToken = async (refreshToken, storedSubdomain) => {
    if (!refreshToken) {
      console.error("No refresh token found");
      return null;
    }
  
    const refreshEndpoint =
      user_role === "owner"
        ? `http://${storedSubdomain}.streamway.solutions/api/token/refresh/`
        : `http://${storedSubdomain}.streamway.solutions/api/token/employee_refresh/`;
  
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
      window.location.href = "http://streamway.solutions/login";
      return null;
    }
  };

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true; 
  
    const checkAuth = async () => {
      try {
        console.log("haloo")
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("access");
        const refreshToken = urlParams.get("refresh");
        const profile = JSON.parse(urlParams.get("profile"));
        
        
  
        if (accessToken && refreshToken) {

          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
          const decodedToken = jwtDecode(accessToken);
          console.log(profile)
          localStorage.setItem("subdomain", decodedToken.subdomain);
          dispatch(setProfile({
            id : profile.id,
            name: profile.owner_name,
            email: profile.email,
            phone: profile.contact, 
            role:decodedToken.role || 'User',
            company: profile.company || 'Unknown', 
            joined_date: profile.created_on,
          }));
          dispatch(setUserRoleAndPermissions({ 
            role: decodedToken.role, 
            permissions: decodedToken.permissions || [] 
          }));

          window.history.replaceState(null, null, window.location.pathname);
        }
  
        // Get stored tokens and subdomain
        let storedSubdomain = localStorage.getItem("subdomain");
        let token = localStorage.getItem("access_token");
        let storedRefreshToken = localStorage.getItem("refresh_token");

        if (!storedSubdomain) {
          const hostname = window.location.hostname;
          const parts = hostname.split(".");
          if (parts.length > 1 && parts[0] !== "localhost") {
            storedSubdomain = parts[0];
            localStorage.setItem("subdomain", storedSubdomain);
            console.log(storedSubdomain)
          }
          
        }

        if (PUBLIC_WITHOUT_SUBDOMAIN.has(location.pathname)) {
          setState({ subdomain: null, isLoading: false, isValid: false, tenantIdentified: false });
          return;
        }

        if (!storedSubdomain) {
          console.log("No subdomain found. Redirecting to public login...");
          setState({ isLoading: false, isValid: false });
          window.location.href = "http://streamway.solutions/login";
          return;
        }
      if (PUBLIC_WITH_SUBDOMAIN.has(location.pathname)) {
          try {
            const tenantResponse = await axios.get(`http://${storedSubdomain}.streamway.solutions/api/`);
            if (tenantResponse.data.status) {
              console.log("Valid tenant, continuing...");
              setState({
                subdomain: storedSubdomain,
                isLoading: false,
                isValid: true,
              });
              dispatch(setEmployeeSubdomain(storedSubdomain));
            } else {
              console.log("Invalid tenant. Redirecting to home...");
              setState({ isLoading: false, isValid: false });
              navigate("/", { replace: true });
            }
            return;
          } catch (error) {
            console.error("Tenant check failed:", error);
            setState({ isLoading: false, isValid: false });
            navigate("/", { replace: true });
            return;
          }
        }

        if (!token || (token && isTokenExpired(token))) {
          if (storedRefreshToken) {
            console.log("Access token missing or expired. Trying to refresh...");
            token = await refreshAccessToken(storedRefreshToken, storedSubdomain);
            
            if (!token) {

              setState({ isLoading: false, isValid: false });
              window.location.href = "http://streamway.solutions/login";
              return;
            }
          } else {

            setState({ isLoading: false, isValid: false });
            window.location.href = "http://streamway.solutions/login";
            return;
          }
        }
  

        if (token && !isTokenExpired(token)) {
          console.log("Valid token found, proceeding with authenticated session");
          setState({
            subdomain: storedSubdomain,
            isLoading: false,
            isValid: true,
          });

          if (window.location.hostname !== `${storedSubdomain}.localhost` && 
              window.location.hostname !== "localhost") {
            window.location.href = `http://${storedSubdomain}.streamway.solutions/dashboard`;
          }
          return;
        }
  
      } catch (error) {
        console.error("Unexpected error in checkAuth:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setState({ isLoading: false, isValid: false });
        window.location.href = "http://streamway.solutions/login";
      }
    };
  
    checkAuth();
  }, [location.pathname]);
  
  const contextValue = useMemo(() => state, [state.subdomain, state.isLoading, state.isValid]);

  return <SubdomainContext.Provider value={contextValue}>{children}</SubdomainContext.Provider>;
};

export const useSubdomain = () => {
  const context = useContext(SubdomainContext);
  if (!context) {
    throw new Error("useSubdomain must be used within SubdomainProvider");
  }
  return context;
};