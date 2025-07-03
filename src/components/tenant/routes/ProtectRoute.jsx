import { Navigate, useLocation } from "react-router-dom";
import { useSubdomain } from "../../../Subdomain";

const ProtectedRoute = ({ children }) => {
  const { isValid, isLoading, tenantIdentified } = useSubdomain();
  const location = useLocation();

  // Check if URL contains authentication parameters (tokens being processed)
  const hasAuthParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('access') && urlParams.has('refresh') && urlParams.has('profile');
  };

  // Show loading state while authentication is being checked OR if URL params are being processed
  if (isLoading || hasAuthParams()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {hasAuthParams() ? "Processing authentication..." : "Authenticating..."}
          </p>
        </div>
      </div>
    );
  }

  // If not valid or tenant not identified, redirect to login
  if (!isValid || !tenantIdentified) {
    // Use window.location.href for external redirect as you were doing
    window.location.href = "https://streamway.solutions/login";
    
    // Return null to prevent rendering while redirect is happening
    return null;
  }

  // If everything is valid, render the protected content
  return children;
};

export default ProtectedRoute;