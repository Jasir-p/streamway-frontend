import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Fetch tenants with support for pagination
export const fetchallTenants = createAsyncThunk(
  'tenants/fetchallTenants',
  async (url = '/action/', { rejectWithValue }) => {
    try {
      const response = await api.get(url);
      console.log(response.data); // Check API Response
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
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
      });
  },
});

export const { resetTenants } = tenantSlice.actions;
export default tenantSlice.reducer;
