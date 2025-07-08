import subdomainInterceptors from "./getSubdomainInterceptors"

export const getUser = async (type) => {
    

    try{
        let data;

        if (type === 'owner') {
            data ={
                "role": type
            }}
            else {
             data ={
                    "user_id":type
                }}
        
        
        const response = await subdomainInterceptors.get("/api/get-employee/",{ params: data })
        
        return response.data
        } catch (error) {
            
            return null
            }

    }

export const AssignTo = async (data)=>{
    try{
        const response =await subdomainInterceptors.patch("/api/lead-assign/",data)
        
        return response
        } catch (error) {
            
            return null
            }
}
  
export const deleteLeads = async (data)=>{
    try{
        const response =await subdomainInterceptors.delete("/api/leads/",{data:data})
        
        return response
        } catch (error) {
            
            return null
            }
            }

export const addLeadNote = async (data)=>{
    try{
        const response =await subdomainInterceptors.post("/api/lead-note/",data)
        
        return response
        } catch (error) {
            
            return null
            }
            }