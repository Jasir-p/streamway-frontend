import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";
import { fixPaginationUrl } from "../../components/utils/fixPaginationUrl";



export const fetchEmails = createAsyncThunk(
  "emails/fetchEmails",
  async ({ userID = null, url}, { rejectWithValue }) => {
    console.log(url);
    
    try {
      const params = {};
      
      if (userID) {
        params.user_id = userID; 
      }

      const response = await subdomainInterceptors.get(url, { params });
      const data = response.data
      data.next = fixPaginationUrl(data.next)
      data.previous= fixPaginationUrl(data.previous)
      return data;
    } catch (error) {
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const addEmail = createAsyncThunk("emails/addEmail",
    async (data, { rejectWithValue }) => {
      
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
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
      totalCount: 0,
      next:null,
      previous:null
    },
    reducers: {
      resetEmailState: (state) => {
        state.emails = [];
        state.currentPage = 1;
        state.totalPages = 1;
        state.hasNext = false;
        state.hasPrevious = false;
        state.totalCount = 0;
        state.error = null;
      },
      setCurrentPage: (state, action) => {
        state.currentPage = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchEmails.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchEmails.fulfilled, (state, action) => {
          state.loading = false;
          
          // Handle paginated response
          if (action.payload.results) {
            state.emails = action.payload.results;
            state.totalCount = action.payload.count;
            state.hasNext = !!action.payload.next;
            state.hasPrevious = !!action.payload.previous;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
            
            // Calculate total pages if page_size is available
            if (action.payload.page_size) {
              state.totalPages = Math.ceil(action.payload.count / action.payload.page_size);
            }
          } else {
            // Handle non-paginated response (backward compatibility)
            state.emails = action.payload;
            state.totalCount = action.payload.length;
            state.hasNext = false;
            state.hasPrevious = false;
            state.totalPages = 1;
          }
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
          state.emails.unshift(action.payload); // Add new email at the beginning
          state.totalCount += 1;
        })
        .addCase(addEmail.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add email';
        });
    },
});

export const { resetEmailState, setCurrentPage } = emailSlice.actions;
export default emailSlice.reducer;