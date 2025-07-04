
import api from "../../../api";
import defaultInterceptor from "../../../Intreceptors/defaultInterceptors";
import subdomainInterceptors from "../../../Intreceptors/getSubdomainInterceptors";




 export const Logout = async (role,navigate) => {
    
    
    
    try {
        const refreshToken = localStorage.getItem("refresh_token"); // Get stored refresh token

        if (!refreshToken) {
            console.error("No refresh token found.");
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

        console.log(response.data);

        // Clear stored tokens
        const subdomain = localStorage.getItem("subdomain");
        localStorage.clear();
        if (role==="owner"){
            navigate('/login')
        }
        else{
            navigate(`/${subdomain}/signin`)}
        

        
    } catch (error) {
        console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
};


export const adminLogout= async(navigate)=>{
    try {
        const refreshToken = localStorage.getItem("refresh_token"); // Get stored refresh token

        if (!refreshToken) {
            console.error("No refresh token found.");
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

        console.log(response.data);

        // Clear stored tokens
        localStorage.clear();
        
        navigate("/admin/login")}
        

        
     catch (error) {
        console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
};
