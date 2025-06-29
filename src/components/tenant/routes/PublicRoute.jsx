import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth); 
  const token = localStorage.getItem("access_token");

  const shouldRedirect = isAuthenticated || token;

  return shouldRedirect ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
