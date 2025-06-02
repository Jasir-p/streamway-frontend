import subdomainInterceptors from "./getSubdomainInterceptors";

export const taskChange = async (task_id,data)=> {
    try{
        const response = await subdomainInterceptors.patch(`/api/task-detail/${task_id}/`,data)
        return response
    }catch(error){
        return error.message
    }

}