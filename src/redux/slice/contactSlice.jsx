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
        .addCase(fetchContacts.pending, (state, action) => {
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
                    }
                    });


export default contactSlice.reducer;
