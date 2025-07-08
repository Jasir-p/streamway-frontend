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
    
    
    return response.data;
  } catch (error) {
    
    
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
    
    
    return response.data;
  } catch (error) {
    
    
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
    
    
    return response.data;
  } catch (error) {
    
    
    return [];
  }
};