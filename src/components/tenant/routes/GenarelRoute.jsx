import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRouteProtection = ({ children, redirectIfAuthenticated = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (redirectIfAuthenticated) {
      // For guest-only routes (like login)
      if (accessToken) {
        navigate('/admin/dashboard', { replace: true });
      }
    } else {
 
      if (!accessToken) {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [navigate, redirectIfAuthenticated]);

  return children;
};

export default AdminRouteProtection;
