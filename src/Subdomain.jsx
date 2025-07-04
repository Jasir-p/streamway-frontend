import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEmployeeSubdomain } from "./redux/slice/EmployeeSlice";
import { setUserRoleAndPermissions } from "./redux/slice/authrizeSlice";
import { setProfile } from "./redux/slice/ProfileSlice";
import { updateSubdomainBaseUrl } from "./Intreceptors/getSubdomainInterceptors";

const SubdomainContext = createContext(null);

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

  // ✅ Extract tenant name from subfolder
  const extractSubfolderFromPathname = useCallback(() => {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean); // removes empty parts
    return parts.length > 0 ? parts[0] : null;
  }, []);

  const redirectToLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);

  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const subdomain = extractSubfolderFromPathname(); // 🔁 now using folder instead of subdomain
    if (!subdomain) {
      setState({
        subdomain: null,
        isLoading: false,
        isValid: false,
        tenantIdentified: false,
      });
      redirectToLogin();
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:575/${subdomain}/api/profile/`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200 && res.data) {
        const { profile, role, permissions } = res.data;

        dispatch(
          setProfile({
            id: profile.id,
            name: profile.owner_name,
            email: profile.email,
            phone: profile.contact,
            role: role || "User",
            company: profile.company || "Unknown",
            joined_date: profile.created_on,
          })
        );

        dispatch(setUserRoleAndPermissions({ role, permissions }));
        dispatch(setEmployeeSubdomain(subdomain));
        updateSubdomainBaseUrl(subdomain); // make sure this function supports subfolder baseUrl

        setState({
          subdomain,
          isLoading: false,
          isValid: true,
          tenantIdentified: true,
        });
      } else {
        throw new Error("Not authenticated");
      }
    } catch (err) {
      console.error("❌ Auth Init Failed:", err.message);
      setState({
        subdomain: null,
        isLoading: false,
        isValid: false,
        tenantIdentified: false,
      });
      redirectToLogin();
    }
  }, [dispatch, extractSubfolderFromPathname, redirectToLogin]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    initializationRef.current = false;
    const timer = setTimeout(() => {
      initializeAuth();
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const contextValue = useMemo(
    () => ({
      subdomain: state.subdomain,
      isLoading: state.isLoading,
      isValid: state.isValid,
      tenantIdentified: state.tenantIdentified,
    }),
    [state]
  );

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
