import subdomainInterceptors from "../../../../Intreceptors/getSubdomainInterceptors";

export const getDashBordContent = async (userId) => {
  try {
    const params = {};
    if (userId) {
      params.userId = userId;
    }

    const response = await subdomainInterceptors.get('/api/tenant_dashboard_content/', {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard content:', error);
    throw error;
  }
};
