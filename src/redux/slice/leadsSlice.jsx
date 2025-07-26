import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";
import { fixPaginationUrl } from "../../components/utils/fixPaginationUrl";


// Updated Redux slice functions with backend search support

export const fetchLeadsEmployee = createAsyncThunk(
  'leads/fetchLeads', 
  async ({ userId, search = '', filters = {}}, { rejectWithValue }) => {
    try {
      const params = {
        userId: userId,
      };
      
      // Add search parameters only if search is provided
      if (search.trim()) {
        params.search = search.trim();
      }
      if (filters.status && filters.status !== '') {
          params.status = filters.status;
        }
        
        if (filters.source && filters.source !== '') {
          params.source = filters.source;
        }
      
      const response = await subdomainInterceptors.get("/api/leads/", { params });
      const data = response.data;
      data.next = fixPaginationUrl(data.next);
      data.previous = fixPaginationUrl(data.previous);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLeadsOwner = createAsyncThunk(
  'leads/fetchLeadsOwner',
  async ({ url = "/api/leads/", search = ''  , filters = {}} = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      let requestUrl = url;
      const params = {};
      

      if (url === "/api/leads/") {
        if (search.trim()) {
          params.search = search.trim();
        }
        if (filters.status && filters.status !== '') {
          params.status = filters.status;
        }
        
        if (filters.source && filters.source !== '') {
          params.source = filters.source;
        }
 
      }
      
      const response = await subdomainInterceptors.get(requestUrl, { 
        params: Object.keys(params).length > 0 ? params : undefined 
      });
      
      const data = response.data;
      data.next = fixPaginationUrl(data.next);
      data.previous = fixPaginationUrl(data.previous);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const addLeads = createAsyncThunk('leads/ leadsAdd', async (data, { rejectWithValue }) => {
    try {
        const response = await subdomainInterceptors.post("/api/leads/", data);
        return response.data
        
        } catch (error) {
            return rejectWithValue(error.message);
            }
            })

export const editLead = createAsyncThunk('leads/leadsEdit', async(data,{rejectWithValue})=>{
    
    try{
        const response = await subdomainInterceptors.patch("/api/leads/", data)
        return response.data
    }
    catch(error){
        return  rejectWithValue(error.message);
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
                .addCase(editLead.fulfilled, (state, action) => {
                    const updatedLead = action.payload;
                    const index = state.leads.findIndex(lead => lead.id === updatedLead.id);
                    if (index !== -1) {
                        state.leads[index] = updatedLead;
                    }
                    state.loading = false;
                })
                .addCase(editLead.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(addLeads.pending, (state) =>
                    {
                        state.loading = true;
                        state.error = null;
                        }
                        )
                    .addCase(addLeads.fulfilled, (state, action) => {
                        const newLead = action.payload.data;
                        state.leads.push(newLead);
                        state.loading = false;
                    })
                }
                            })
            

export default leadsSlice.reducer;