import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";

export const fetchContacts = createAsyncThunk('contacts/fetchAll', async (url='/api/contact/',{rejectWithValue})=> {
    try {
        const response = await subdomainInterceptors.get(url);
        return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
            }
            });
export const addContact = createAsyncThunk('contacts/AddContact', async (data,{rejectWithValue})=>{
    try{
        const response = await subdomainInterceptors.post('/api/contact/',data)
        console.log(response.data);
        
        return response.data
    }catch(error){
        return rejectWithValue(error.message)
    }
})
export const deleteContacts = createAsyncThunk('contacts/deleteContact', async(contact_ids,{rejectwithValue})=>{
    console.log(contact_ids);
    
    try {
        const response = await subdomainInterceptors.delete('api/contact/', {data:{contact_ids:contact_ids}})
        return contact_ids

    }catch(error){
        return rejectwithValue(error)
    }
})

const initialState = {
    contacts: [],
    error:null,
    loading:null,
    next:null,
    previous:null,
}

const contactSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchContacts.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
                state.contacts = action.payload.results;
                })
 
                .addCase(fetchContacts.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
                    })
        .addCase(addContact.pending, (state)=>{
            state.loading = true,
            state.error=null
        })
        .addCase(addContact.fulfilled, (state, action)=>{
            state.loading= false
            state.contacts.unshift(action.payload.contact)
            
        })
        .addCase(addContact.rejected,(state,action)=>{
            state.loading = false,
            state.error = action.payload
        })
        .addCase(deleteContacts.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(deleteContacts.fulfilled, (state, action) => {
            state.loading = false;
            const deletedIds = action.payload;
            state.contacts = state.contacts.filter(contact => !deletedIds.includes(contact.id));
        })
        .addCase(deleteContacts.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
                    }
                    });




export default contactSlice.reducer;
