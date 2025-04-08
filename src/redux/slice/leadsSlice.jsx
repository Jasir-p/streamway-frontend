import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";


export const fetchLeadsEmployee = createAsyncThunk('leads/fetchLeads', async (userId,{rejectWithValue}) => {
    try{
        const data ={
            "userId":userId
        }
        const response = await subdomainInterceptors.get("/api/leads/",{ params: data });
        return response.data;
        }catch(error){
            return rejectWithValue(error.message);
            }
            })

export const fetchLeadsOwner = createAsyncThunk('leads/fetchLeadsOwner', async (url = "/api/leads/", {
    rejectWithValue
    }) => {
        try{
            const response = await subdomainInterceptors.get(url);
            console.log(response)
            return response.data;
            
            }catch(error){
                return rejectWithValue(error.message);
                }
                })


export const addLeads = createAsyncThunk('leads/ leadsAdd', async (data, { rejectWithValue }) => {
    try {
        const response = await subdomainInterceptors.post("/api/leads/", data);
        return response;
        } catch (error) {
            return rejectWithValue(error.message);
            }
            })


const initialState = {
    leads: [],
    loading: null,
    error: null,
    next: null,
    previous: null
}

const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        resetLeads(state) {
            state.leads = []
            }
        },
        
    extraReducers: (builder) => {
        builder
        .addCase(fetchLeadsEmployee.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchLeadsEmployee.fulfilled, (state, action) => {
                state.leads = action.payload.results;
                state.loading = false;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
                })
            .addCase(fetchLeadsEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                })
            .addCase(fetchLeadsOwner.pending, (state) => {
                state.loading = true;
                state.error = null;
                })
            .addCase(fetchLeadsOwner.fulfilled, (state, action) => {
                state.leads = action.payload.results;
                state.loading = false;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
                })
            .addCase(fetchLeadsOwner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                })
                                }
                            })

export default leadsSlice.reducer;