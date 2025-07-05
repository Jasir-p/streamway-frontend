import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";
import axios from "axios";



export const fetchTask = createAsyncThunk(
    'task/fetchTask',
    async ({ role, userID, url }, { rejectWithValue }) => {
        console.log(userID);
        
      try {
        let requestUrl = url || '/api/tasks/';
        
  
        if (!url && role !== 'owner' && userID) {
          const params = new URLSearchParams({ userID });
          requestUrl += `?${params.toString()}`;
        }
  
        const response = await subdomainInterceptors.get(requestUrl);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const  addTask =  createAsyncThunk('task/addTask', async (taskData, {rejectWithValue}) => {
    try {
        const token = localStorage.getItem("access_token");
        const subdomain = localStorage.getItem("subdomain");
    
        if (!token) return rejectWithValue("No token found, please log in again.");
        if (!subdomain) return rejectWithValue("Subdomain not set.");
    
        
    
        const response = await axios.post(`https://api.streamway.solutions/${subdomain}/api/tasks/`, taskData, {
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

export const deleteTask = createAsyncThunk('task/deleteTask', async(task_id,{rejectWithValue})=>{
    console.log(task_id);
    
    try{
        const response = await subdomainInterceptors.delete(`/api/task-detail/${task_id}/`);

        return task_id
    }catch(error){
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})
export const editTask = createAsyncThunk(
  'task/editTask',
  async ({ task_id, taskData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const subdomain = localStorage.getItem("subdomain");

      if (!token) return rejectWithValue("No token found, please log in again.");
      if (!subdomain) return rejectWithValue("Subdomain not set.");

      const response = await axios.patch(
        `https://api.streamway.solutions/${subdomain}/api/tasks/`,
        taskData,
        {
          params: { task_id: task_id },  // Matches your Django patch logic: request.data.get("id")
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to update task");
    }
  }
);



const initialState = {
    tasks: [],
    loading:null,
    error:null,
    next:null,
    previous:null,
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
            state.tasks = action.payload.results;
            state.loading = false;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
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
                .addCase(deleteTask.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(deleteTask.fulfilled, (state, action) => {
                    state.loading = false;
                   
                    state.tasks = state.tasks.filter(task => task.id !== action.payload);
                  })
                  .addCase(deleteTask.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload || 'Failed to delete task';
                  })
                .addCase(editTask.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                    })
                    .addCase(editTask.fulfilled, (state, action) => {
                        state.loading = false;
                        const updatedTask = action.payload;
                        state.tasks = state.tasks.map(task =>
                        task.id === updatedTask.id ? updatedTask : task
                        );
                    })
                    .addCase(editTask.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload || 'Failed to update task';
                    });
                }
                }
            )
export default taskSlice.reducer;
