import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";


export const fetchCompany = createAsyncThunk("companyDetails/fetchCompany", async (id,{rejectWithValue}) => {
    
    try{
    const response = await subdomainInterceptors.get(`/company_details/${id}`);
    return response.data;
    }catch(error){
        
        
        return rejectWithValue(error.response?.data || "error getting company details");
    }
    
    });

    export const updateCompany = createAsyncThunk(
        "companyDetails/updateCompany", 
        async ({userId, data}, {rejectWithValue}) => {
          
          try {
            const response = await subdomainInterceptors.put(`/company_details/${userId}`, data);
            return response.data;
          } catch (error) {
            
            return rejectWithValue(error.response?.data || "error updating company details");
          }
        }
      );


const companyDetailsSlice = createSlice({
    name: "companyDetails",
    initialState: {
        company: [],
        loading:false,
        error:null,
        },
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(fetchCompany.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                });
                builder.addCase(fetchCompany.fulfilled, (state, action) => {
                    state.loading = false;
                    state.company = action.payload;
                    });
                    builder.addCase(fetchCompany.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                        });
                        builder.addCase(updateCompany.pending, (state, action) => {
                            state.loading = true;
                            state.error = null;
                            });
                            builder.addCase(updateCompany.fulfilled, (state, action) => {
                                state.loading = false;
                                state.company = action.payload;
                                });
                                builder.addCase(updateCompany.rejected, (state, action) => {
                                    state.loading = false;
                                    state.error = action.error.message;
                                    });
                                    
                        }
                        })

export default companyDetailsSlice.reducer;

                        
