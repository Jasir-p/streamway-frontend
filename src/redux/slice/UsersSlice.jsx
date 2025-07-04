import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("access_token");
        const subdomain = localStorage.getItem("subdomain");

        if (!token) return rejectWithValue("No token found, please log in again.");
        if (!subdomain) return rejectWithValue("Subdomain not set.");

        const response = await subdomainInterceptors.get('/employee/');

        console.log(response.data);
        return response.data.employee;
    } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
});

export const addUsers = createAsyncThunk('users/AddUsers', async (data, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("access_token");
        const subdomain = localStorage.getItem("subdomain");

        if (!token) return rejectWithValue("No token found, please log in again.");
        if (!subdomain) return rejectWithValue("Subdomain not set.");

        const response = await subdomainInterceptors.post('/employee/', data);

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to add users");
    }
});

export const deleteUser = createAsyncThunk('users/DeleteUsers', async(user_id, {rejectWithValue})=>{
    try{
        const data ={
            "user_id":user_id
        }
        const token = localStorage.getItem("access_token");
        const subdomain = localStorage.getItem("subdomain");

        if (!token) return rejectWithValue("No token found, please log in again.");
        if (!subdomain) return rejectWithValue("Subdomain not set.");
        const response = await subdomainInterceptors.delete('employee/',{
            data:data
        });
        console.log(response.data);
        return response.data;
    }catch(error){
        console.error("Error deleting user:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to delete user");
    }
})
export const editUser = createAsyncThunk('users/EditUser', async ({ user_id, user_data }, { rejectWithValue }) => {
    console.log(user_id);
    
    const data = { user_id,user_data };
    try{
        const response = await subdomainInterceptors.put( "/employee/",data)
        return response.data
    
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to edit user");
    }
})


const userListSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false,
        error: ""
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = [...state.users, action.payload];
            })
            .addCase(addUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state)=>{
                state.loading = true;
                state.error = null;
                
            })
            .addCase(deleteUser.fulfilled, (state,action)=>{
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload.id);
                
            })
            .addCase(deleteUser.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload;
                })
    }
});

export default userListSlice.reducer;
