import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRouteProtection = ({ children, redirectIfAuthenticated = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');


    if (!accessToken && !redirectIfAuthenticated) {
      navigate('/admin/login', { replace: true });
      return;
    }

 
    if (accessToken &&  redirectIfAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
  }, [navigate, redirectIfAuthenticated]);

  return children;
};

export default AdminRouteProtection;
