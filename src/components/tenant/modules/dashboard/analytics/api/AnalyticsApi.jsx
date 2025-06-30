import subdomainInterceptors from "../../../../../../Intreceptors/getSubdomainInterceptors";

export const getTeamAnalyse = async (filter) => {
  try {

    
    const cleanFilter = Object.fromEntries(
      Object.entries(filter || {}).filter(([_, v]) => v != null && v !== '')
    );

    const response = await subdomainInterceptors.get('/api/get-team-analytics/', {
      params: {
        filter: JSON.stringify(cleanFilter)
      }
    });
    
    console.log("Team analytics response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error fetching team analytics:", error?.response?.data || error.message);
    console.error("Full error object:", error);
    return [];
  }
};

export const getEmployeeAnalyse = async (filter,userId=null) => {
  try {



    const cleanFilter = Object.fromEntries(
      Object.entries(filter || {}).filter(([_, v]) => v != null && v !== '')
    );
    const response = await subdomainInterceptors.get('/api/get-employee-analytics/', {
      params: {
        filter: JSON.stringify(cleanFilter),
        ...(userId && { userId: userId })  
      }
    });
    
    console.log("Employee analytics response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee analytics:", error?.response?.data || error.message);
    console.error("Full error object:", error);
    return [];
  }
};


export const getTenantAnalyse = async (filter) => {
  try {

    
    const cleanFilter = Object.fromEntries(
      Object.entries(filter || {}).filter(([_, v]) => v != null && v !== '')
    );

    const response = await subdomainInterceptors.get('/api/get-tenant-analytics/', {
      params: {
        filter: JSON.stringify(cleanFilter)
      }
    });
    
    console.log("Tenant analytics response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Error fetching tenant analytics:", error?.response?.data || error.message);
    console.error("Full error object:", error);
    return [];
  }
};