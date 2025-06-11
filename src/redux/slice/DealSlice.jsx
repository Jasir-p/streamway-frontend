import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import subdomainInterceptors from '../../Intreceptors/getSubdomainInterceptors';

// Fetch all deals
export const fetchDeals = createAsyncThunk(
  'deals/fetchDeals',
  async ({ role, userId }, { rejectWithValue }) => {
    try {
      let url = '/api/deals/';
      if (role !== 'owner' && userId) {
        url += `?userId=${userId}`;
      }

      const response = await subdomainInterceptors.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Add a new deal
export const addDeal = createAsyncThunk(
  'deals/addDeal',
  async (deal, { rejectWithValue }) => {
    try {
      const response = await subdomainInterceptors.post('/api/deals/', deal);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDealsBulk = createAsyncThunk(
  'deals/updateDealsBulk',
  async ({ dealIds, updates }, { rejectWithValue }) => {
    try {
      const response = await subdomainInterceptors.patch('/api/deals/', {
        deal_ids: dealIds,
        updates: updates,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dealSlice = createSlice({
  name: 'deals',
  initialState: {
     deals: [],
        loading: false,
        error: null,
        count: 0,
        next: null,
        previous: null,
  },
  reducers: {
    clearDealError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.results || [];
        state.count = action.payload.count || 0;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
       
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals.unshift(action.payload); // add to top
        state.count += 1;
      })
      .addCase(addDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(updateDealsBulk.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateDealsBulk.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload|| [];

        })
        .addCase(updateDealsBulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        });
        },

        });

export const { clearDealError } = dealSlice.actions;
export default dealSlice.reducer;
