import subdomainInterceptors from "../../../../../../Intreceptors/getSubdomainInterceptors";

export const getDealOverView = async (dealId) => {
    
    
  try {
    const response = await subdomainInterceptors.get('/api/deal-overview/', {
      params: {
        dealId: dealId,
      },
    });
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

export const dealAddNote = async (data) =>{
  try {
    const response = await subdomainInterceptors.post('/api/deal-note/', data);
    return response.data;
  }catch(error){
    
  }
}

export const dealDeleteNote = async (data) =>{
  try {
    const response = await subdomainInterceptors.delete('/api/deal-note/', {
      data:data
    }
  )
}catch(error){
  return error
}
}
