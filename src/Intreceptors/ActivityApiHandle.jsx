import subdomainInterceptors from "./getSubdomainInterceptors";

export const taskChange = async (task_id,data)=> {
    try{
        const response = await subdomainInterceptors.patch(`/api/task-detail/${task_id}/`,data)
        return response
    }catch(error){
        return error.message
    }

}

export const selectContactByAccount = async (account_id)=>{
    try{
        const response = await subdomainInterceptors.get(`/api/get-contacts-by-account/${account_id}`)
        return response.data
        
        }catch(error){
            return error.message
            }
            }

