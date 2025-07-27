
import api from "../../../api";
import defaultInterceptor from "../../../Intreceptors/defaultInterceptors";
import subdomainInterceptors from "../../../Intreceptors/getSubdomainInterceptors";
import { persistor } from "../../../redux/store";




 export const Logout = async (role,navigate) => {
    
    
    
    try {
        const refreshToken = localStorage.getItem("refresh_token"); // Get stored refresh token

        if (!refreshToken) {
            
            return;
        }

        const response = await defaultInterceptor.post(
            '/logout/', 
            { refresh_token: refreshToken },  // Send refresh token to backend
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}` // Optional
                }
            }
        );

        

        // Clear stored tokens
        const subdomain = localStorage.getItem("subdomain");
        await persistor.purge();
        localStorage.clear();
        if (role==="owner"){
            window.location.href = '/login';
        }
        else{
            navigate(`/${subdomain}/signin`)}
        

        
    } catch (error) {
        
    }
};


export const adminLogout= async(navigate)=>{
    try {
        const refreshToken = localStorage.getItem("refresh_token"); // Get stored refresh token

        if (!refreshToken) {
            
            return;
        }

        const response = await defaultInterceptor.post(
            '/logout/', 
            { refresh_token: refreshToken },  // Send refresh token to backend
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}` // Optional
                }
            }
        );

        

        // Clear stored tokens
        localStorage.clear();
        
        navigate("/admin/login")}
        

        
     catch (error) {
        
    }
};
