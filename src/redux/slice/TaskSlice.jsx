import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";
import axios from "axios";

export const fetchTask  = createAsyncThunk('task/fetchTask', async (_,{rejectWithValue}) => {
    try {
        const response = await subdomainInterceptors.get('/api/tasks/')
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.message);
        
        }
        })

export const  addTask =  createAsyncThunk('task/addTask', async (taskData, {rejectWithValue}) => {
    try {
        const token = localStorage.getItem("access_token");
        const subdomain = localStorage.getItem("subdomain");
    
        if (!token) return rejectWithValue("No token found, please log in again.");
        if (!subdomain) return rejectWithValue("Subdomain not set.");
    
        
    
        const response = await axios.post(`http://${subdomain}.localhost:8000/api/tasks/`, taskData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
    
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error submitting task:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to submit task");
    }
            })

const initialState = {
    tasks: [],
    loading:null,
    error:null
    }
const taskSlice = createSlice({
    name:'task',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTask.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
        .addCase(fetchTask.fulfilled, (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
            })
        .addCase(fetchTask.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
        .addCase(addTask.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addTask.fulfilled, (state, action) => {
            state.tasks = [...state.tasks, action.payload];
            state.loading = false;
            })
            .addCase(addTask.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                })
                }
                }
            )
export default taskSlice.reducer;
