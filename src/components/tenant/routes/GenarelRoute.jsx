import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component should be used to wrap your public routes (login, signup, etc.)
const GeneralRouteProtection = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated with a subdomain
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem('access_token');
      const subdomain = localStorage.getItem('subdomain');
      console.log("hallo genaral",accessToken,subdomain)
      // If token and subdomain exist, redirect to the subdomain's dashboard
      if (accessToken && subdomain) {
        // Prevent adding to history by using replace
        console.log("hallo genaral")
        window.location.replace(`http://${subdomain}.localhost:5173/dashboard`);
        return null;
      }
    };
    
    checkAuthStatus();
    
    // Listen for history changes (like browser back button)
    const handlePopState = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return children;
};

export default GeneralRouteProtection;