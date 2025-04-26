import subdomainInterceptors from "./getSubdomainInterceptors"

export const assignToContact = async(data)=>{
    try{
        const response = await subdomainInterceptors.patch('/api/contact-assign/',data)
        return response
    }catch(error){
        return error
    }

}