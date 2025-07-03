import { Navigate, useLocation } from "react-router-dom";
import { useSubdomain } from "../../../Subdomain";

const ProtectedRoute = ({ children }) => {
  const { isValid, isLoading, tenantIdentified } = useSubdomain();
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
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