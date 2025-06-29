import defaultInterceptor from "../../../../Intreceptors/defaultInterceptors";

export const getlogs = async () =>{
    try{
        const response = await defaultInterceptor.get("/api/get-active-logs/")
        console.log(response.data);
        
        return response.data
        }
        catch(error){
            console.log(error)
            }
            }

