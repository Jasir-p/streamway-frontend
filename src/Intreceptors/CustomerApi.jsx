import subdomainInterceptors from "./getSubdomainInterceptors"

export const assignToContact = async(data)=>{
    try{
        const response = await subdomainInterceptors.patch('/api/contact-assign/',data)
        console.log(response);
        
        return response
    }catch(error){
        return error
    }

}
export const fetchAccountByID = async(account_id)=>{
    console.log(account_id);
    
    try{
        const response = await subdomainInterceptors.get('/api/account-details/',
            {params:{account_id}}
        )
        return response.data
    }catch(error){
        return error
    }
}

export const addCustomFields = async(account_id,data)=>{
    console.log(account_id);
    
    try{
        const response = await subdomainInterceptors.patch('/api/account-customized/',data,
            {params:{account_id}}
        )
        return response.data
    }catch(error){
        return error
    }
}

export const deleteCustomFields = async(account_id,data)=>{
    console.log(account_id);
    
    try{
        const response = await subdomainInterceptors.delete('/api/account-customized/',{data,
            params:{account_id}}
        
        )
        return response.data
    }catch(error){
        return error
    }
}
