import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import defaultInterceptor from "../../../Intreceptors/defaultInterceptors";


const fixPaginationUrl = (url) => {
  return url?.replace(/^http:/, 'https:');
};

export const fetchallTenants = createAsyncThunk(
  'tenants/fetchallTenants',
  async (url = '/action/', { rejectWithValue }) => {
    try {
      const response = await defaultInterceptor.get(url);
      const data = response.data;
      data.next = fixPaginationUrl(data.next);
      data.previous = fixPaginationUrl(data.previous);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const editTenants = createAsyncThunk(
  'tenants/editTenant',
  async ({ tenant_id, data }, { rejectWithValue }) => {
    
    
    try {
      const response = await defaultInterceptor.put("/action/", data, {
        params: { tenant_id }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  loading: false,
  error: null,
  tenants: [],
  next: null,
  previous: null,
};

const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    resetTenants: (state) => {
      state.loading = false;
      state.error = null;
      state.tenants = [];
      state.next = null;
      state.previous = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchallTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchallTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload.results;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchallTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editTenants.pending,(state)=>{
        state.loading = true
        state.error= null
      })
      .addCase(editTenants.fulfilled, (state,action)=>{
        state.loading = false
        const updatedTenant = action.payload
        const index = state.tenants.findIndex(t=>t.id===updatedTenant.id)
        if (index !== -1) {
          state.tenants[index] = updatedTenant;
        }
      })
      .addCase(editTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { resetTenants } = tenantSlice.actions;
export default tenantSlice.reducer;
