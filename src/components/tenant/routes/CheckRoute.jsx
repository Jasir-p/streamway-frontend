import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SubdomainCaptureRoute = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const subdomain = pathSegments[0];


    if (subdomain && /^[a-zA-Z0-9_-]+$/.test(subdomain)) {
      localStorage.setItem("subdomain", subdomain);
      localStorage.setItem("isEmployee","true")
    }
  }, [location]);

  return children;
};

export default SubdomainCaptureRoute;
