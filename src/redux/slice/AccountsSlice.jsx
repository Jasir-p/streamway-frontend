import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";


export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async (url='/api/accounts/',{rejectWithValue}) => {
    try{
        const response = await subdomainInterceptors.get(url)
        return response.data
    }
    catch(error){
        return rejectWithValue(error.message)
        }
        }
    )


const initialState = {
    accounts: [],
    error:null,
    loading:null,
    next:null,
    previous:null,
    }

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAccounts.pending, (state) => {
            state.loading = true
            })
        .addCase(fetchAccounts.fulfilled, (state, action) => {
            state.loading=false
            state.accounts = action.payload.results
            state.next = action.payload.next
            state.previous = action.payload.previous
            })
        .addCase( fetchAccounts.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            })
            }
            })

export default accountsSlice.reducer