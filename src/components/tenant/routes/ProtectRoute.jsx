import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  const storedFolder = localStorage.getItem("subdomain");
  const role = useSelector((state) => state.auth.role);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentFolder = pathSegments[0];


  if (!token || !storedFolder) {
    return <Navigate to="/not-found" replace />;
  }


  if (currentFolder !== storedFolder) {
    return <Navigate to="/not-found" replace />;
  }


  return children;
};

export default ProtectedRoute;
