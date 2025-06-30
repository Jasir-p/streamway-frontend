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
        console.log(data)
        
        const response = await subdomainInterceptors.get("/api/get-employee/",{ params: data })
        console.log(response.data)
        return response.data
        } catch (error) {
            console.error(error)
            return null
            }

    }

export const AssignTo = async (data)=>{
    try{
        const response =await subdomainInterceptors.patch("/api/lead-assign/",data)
        console.log(response.data)
        return response
        } catch (error) {
            console.error(error)
            return null
            }
}
  
export const deleteLeads = async (data)=>{
    try{
        const response =await subdomainInterceptors.delete("/api/leads/",{data:data})
        console.log(response.data)
        return response
        } catch (error) {
            console.error(error)
            return null
            }
            }

export const addLeadNote = async (data)=>{
    try{
        const response =await subdomainInterceptors.post("/api/lead-note/",data)
        console.log(response.data)
        return response
        } catch (error) {
            console.error(error)
            return null
            }
            }