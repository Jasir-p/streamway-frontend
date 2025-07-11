import subdomainInterceptors from "../../../../../../Intreceptors/getSubdomainInterceptors";

export const fetchSalesPipeline = async (filterParams = {}) => {
  try {

    const { user_id, filter, ...otherParams } = filterParams;
    
    const params = {};

    if (user_id) {
      params.userId = user_id;
    }
 
    if (filter) {
      params.filter = filter;
    }
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] !== null && otherParams[key] !== undefined && otherParams[key] !== '') {
        params[key] = otherParams[key];
      }
    });

    
    
    const response = await subdomainInterceptors.get('/api/sales-pipeline/', {
      params: params,
    });
    
    return response.data;
  } catch (error) {
    
    throw error;
  }
};