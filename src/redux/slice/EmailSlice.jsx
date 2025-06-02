import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";


export const fetchEmails = createAsyncThunk(
    "emails/fetchEmails",
    async (_, { rejectWithValue }) => {
      try {
        const response = await subdomainInterceptors.get('/api/tenant-email/');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

  export const addEmail = createAsyncThunk("emails/addEmail",
    async (data, { rejectWithValue }) => {
      console.log(data);
      try {
        const response = await subdomainInterceptors.post('/api/tenant-email/', data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );


  const emailSlice = createSlice({
    name: 'emails',
    initialState: {
      emails: [],
      error: null,
      loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchEmails.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchEmails.fulfilled, (state, action) => {
          state.loading = false;
          state.emails = action.payload;
        })
        .addCase(fetchEmails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch emails';
        })
  

        .addCase(addEmail.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addEmail.fulfilled, (state, action) => {
          state.loading = false;
          state.emails.push(action.payload);
        })
        .addCase(addEmail.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add email';
        });
    },
  });
  
  export default emailSlice.reducer;
