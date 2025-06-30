import subdomainInterceptors from "../../../../../../Intreceptors/getSubdomainInterceptors";

export const getDealOverView = async (dealId) => {
    console.log(dealId);
    
  try {
    const response = await subdomainInterceptors.get('/api/deal-overview/', {
      params: {
        dealId: dealId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching deal overview:", error);
    throw error;
  }
};

export const dealAddNote = async (data) =>{
  try {
    const response = await subdomainInterceptors.post('/api/deal-note/', data);
    return response.data;
  }catch(error){
    console.error("Error adding note:", error);
  }
}
