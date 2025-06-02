import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import defaultInterceptor from "../../../Intreceptors/defaultInterceptors";

export const fetchallBillings = createAsyncThunk(
    "fetchallBillings/fetchallBillings",
    async (_, {rejectWithValue}) =>
        {
            try {
                const response = await defaultInterceptor.get("api/tenants/all-bill");
                return response.data;
                } catch (error) {
                    return rejectWithValue(error.message);
                    }
                    }
                    );

const initialState = {
    bills : [],
    status : null,
    error : null,
    loading : false
    };

const billingSlice = createSlice({
    name : "billing",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder) =>
        {
        builder.addCase( fetchallBillings.pending , (state) =>
                {
                    state.status = null;
                    state.loading = true;
                    state.error = null;
                    }
                    )
            .addCase (fetchallBillings.fulfilled , (state , action) =>
                {
                    state.status = "success";
                    state.loading = false;
                    state.bills = action.payload;
                    })
            .addCase (fetchallBillings.rejected , (state , action) => 
                {
                    state.status = "failed";
                    state.loading = false;
                    state.error = action.payload;
                    })
                    }

})
export default billingSlice.reducer;

