import subdomainInterceptors from "./getSubdomainInterceptors"
import defaultInterceptor from "./defaultInterceptors";
import api from "../api";

export const fetchTenantById = async (tenant_id) => {
    try {
        const response = await defaultInterceptor.get("/action/", {
            params: { tenant_id: tenant_id }
        });
        return response.data;
    } catch (error) {
        return error.message;
    }
};
export const handleActive = async (tenant_id) => {
    try {
      const response = await defaultInterceptor.patch("/tenant-access/", {
        tenant_id: tenant_id, // body payload
      });
      return response.data;
    } catch (error) {
      return error.message;
    }
  };
  
  
