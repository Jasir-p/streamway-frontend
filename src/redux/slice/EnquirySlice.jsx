import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";

export const fetchEnquiry = createAsyncThunk('enquiry/fetchEnquiry', async (_,{rejectWithValue}) => {
    try {
        const response = await subdomainInterceptors.get('/api/webenquiry/')
        return response.data;
    }
    catch(error){
        return rejectWithValue(error.message);
        }
        })
export const deleteEnquiry = createAsyncThunk('enquiry/deleteEnquiry', async (ids,{rejectWithValue}) => {
    
    const data= {
        enquiryIds :ids
    }
    
    
    try {
        const response = await subdomainInterceptors.delete("/api/webenquiry/",
            {data:data}
        )
        return response.data;
        }
        catch(error){
            return rejectWithValue(error.message);
            }
            })


const enquirySlice = createSlice({
    name: 'enquiry',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        },
        reducers: {},
        extraReducers: (builder) => {
            builder
            .addCase(fetchEnquiry.pending, (state) => {
                state.status = 'loading'
                })
                .addCase(fetchEnquiry.fulfilled, (state, action) => {
                    state.status = 'succeeded'
                    state.data = action.payload
                    })
                    .addCase(fetchEnquiry.rejected, (state, action) => {
                        state.status = 'failed'
                        state.error = action.payload
                        })
                        }
                        }
                    )

export default enquirySlice.reducer;