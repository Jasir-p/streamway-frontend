import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import subdomainInterceptors from '../../Intreceptors/getSubdomainInterceptors';
import { fixPaginationUrl } from '../../components/utils/fixPaginationUrl';

// Fetch all deals
export const fetchDeals = createAsyncThunk(
  'deals/fetchDeals',
  async ({ role, userId, url }, { rejectWithValue }) => {
    
    
    try {
      let requestUrl = url || '/api/deals/';

      // Append userId if the user is not owner and userId exists
      if (!url && role !== 'owner' && userId) {
        const params = new URLSearchParams({ userId });
        requestUrl += `?${params.toString()}`;
      }
      
      
      const response = await subdomainInterceptors.get(requestUrl);
      const data = response.data
      data.next = fixPaginationUrl(data.next)
      data.previous= fixPaginationUrl(data.previous)
      return data;
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
export const editDeal = createAsyncThunk(
  'deals/editDeal',
  async (updatedData, { rejectWithValue }) => {
    try {
      const cleanedData = {
        ...updatedData,
        account_id: updatedData.account_id?.id || null,
        owner: updatedData.owner?.id || null,
      };
      const response = await subdomainInterceptors.put('/api/deals/', cleanedData);
      console.log(response.data);
      
      return response.data.data; // accessing the nested 'data' key
    } catch (error) {
      console.log(error);
      
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

// Delete deals in bulk
export const deleteDealsBulk = createAsyncThunk(
  'deals/deleteDealsBulk',
  async (dealIds, { rejectWithValue }) => {
    try {
      await subdomainInterceptors.delete('/api/deals/', {
        data: { deal_ids: dealIds },
      });
      return dealIds;
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
      .addCase(editDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editDeal.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDeal = action.payload;
        const index = state.deals.findIndex(deal => deal.id === updatedDeal.id);
        if (index !== -1) {
          state.deals[index] = updatedDeal;
        }
      })
      .addCase(editDeal.rejected, (state, action) => {
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
        })

      .addCase(deleteDealsBulk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDealsBulk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.payload;
        state.deals = state.deals.filter(deal => !deletedIds.includes(deal.id));
        state.count -= deletedIds.length;
      })
      .addCase(deleteDealsBulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        },

        });

export const { clearDealError } = dealSlice.actions;
export default dealSlice.reducer;
