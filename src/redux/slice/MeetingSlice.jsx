import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subdomainInterceptors from '../../Intreceptors/getSubdomainInterceptors';


export const fetchMeeting = createAsyncThunk(
  'meeting/fetchMeeting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subdomainInterceptors.get('/api/meeting/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addMeeting = createAsyncThunk(
  'meeting/addMeeting',
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await subdomainInterceptors.post('/api/meeting/', meetingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const patchMeeting = createAsyncThunk(
  'meeting/patchMeeting',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await subdomainInterceptors.patch(`/api/meeting/${id}/`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteMeeting = createAsyncThunk(
  'meeting/deleteMeeting',
  async (id, { rejectWithValue }) => {
    try {
      await subdomainInterceptors.delete(`/api/meeting/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  meetings: [],
  loading: false,
  error: null,
};


const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    clearMeetingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings.push(action.payload);
      })
      .addCase(addMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(patchMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchMeeting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meetings.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      })
      .addCase(patchMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = state.meetings.filter(m => m.id !== action.payload);
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMeetingError } = meetingSlice.actions;
export default meetingSlice.reducer;
