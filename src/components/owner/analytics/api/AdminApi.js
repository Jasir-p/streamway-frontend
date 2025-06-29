import defaultInterceptor from "../../../../Intreceptors/defaultInterceptors";


export const getAnalyticsData = async (context, params) =>{
    try{
        const response = await defaultInterceptor.get("/api/admin-analytic/")
        return response.data
    }
    catch(error){
        console.log(error)
        }
}
