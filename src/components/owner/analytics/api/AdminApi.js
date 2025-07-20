import defaultInterceptor from "../../../../Intreceptors/defaultInterceptors";


export const getAnalyticsData = async (filters) =>{
    
    
    try{
        const cleanFilter = Object.fromEntries(
      Object.entries(filters || {}).filter(([_, v]) => v != null && v !== '')
    );
    console.log(cleanFilter);
    
        const response = await defaultInterceptor.get("/api/admin-analytic/",
            { params:
                {filter: JSON.stringify(cleanFilter)}}
        )
        return response.data
    }
    catch(error){
        console.log(error)
        }
}
