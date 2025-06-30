import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";


export const fetchInVoiceStatus = createAsyncThunk('invoice/fetchStatus', async()=>{
    const response = await subdomainInterceptors.get('/api/tenant/invoice-status');
    console.log(response.data);
    return response.data;
    
    
});

const initialState = {
    invoice: null,
    loading:false}

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(fetchInVoiceStatus.pending, (state) =>
            {
                state.loading = true;
                }
                )
                .addCase(fetchInVoiceStatus.fulfilled, (state, action) =>
                    {
                        state.invoice =  action.payload.invoice
                        state.loading = false;
                        }
                        )
            
        
    }
})
export default invoiceSlice.reducer;