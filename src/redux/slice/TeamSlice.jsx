import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (userId, { rejectWithValue }) => {
    try {
      const params = {};
      if (userId) {
        params.userId = userId; 


        console.log("Fetching teams for user:", userId);
      }

      const response = await subdomainInterceptors.get('team/', { params });
      console.log("Teams fetched:", response.data);

      return response.data.teams;
    } catch (error) {
      console.error("Error fetching teams:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.detail || error.message || "Failed to fetch teams"
      );
    }
  }
);


export const addTeam = createAsyncThunk('teams/AddTeam',async(data,{rejectWithValue})=>{
    try {
        
        const response = await subdomainInterceptors.post('team/',data);
            return response.data.team;

        }catch(error){
            console.error("Error adding team:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Failed to add team");
            
        }

            
                
})
export const updateTeam = createAsyncThunk('teams/Updateteam', async(data,{rejectWithValue})=>{
    console.log(data)
    try{
        const response = await subdomainInterceptors.put('/team/',data)
        console.log("check",response)
        return response.data
        
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to Remove team")
    }
})

export const partialUpdateTeam = createAsyncThunk('teams/PartialUpdateTeam', async(data,{rejectWithValue})=>
    {
        try{
            const response = await subdomainInterceptors.patch('/team/',data)
            return response.data
            }catch(error){
                return rejectWithValue(error.response?.data || "Failed to Remove team")
                }
                }
            )


export const deleteTeam = createAsyncThunk('teams/DeleteTeam', async(team_id,{rejectWithValue})=>{
    console.log(team_id);
    
    try {
        const response = await subdomainInterceptors.delete('/team/',{data:{"team_id":team_id}})
        return team_id
    }
     catch(error){
        return  rejectWithValue(error.response?.data || "Failed to Remove team")

     }
})

const teamsSlice = createSlice({
    name: 'teams',
    initialState: {
        teams: [],
        status: 'idle',
        error: null,
        loading:false},
        reducers: {},
        extraReducers: (builder) => {
            builder
            .addCase(fetchTeams.pending, (state) => {
                state.status = 'loading'
                state.loading = true
                })
                .addCase(fetchTeams.fulfilled, (state, action) => {
                    state.status = 'succeeded'
                    state.teams = action.payload
                    state.loading = false
                    })
                    .addCase(fetchTeams.rejected, (state, action) => {
                        state.status = 'failed'
                        state.error = action.payload
                        state.loading = false
                        })
                    .addCase(addTeam.pending, (state) => {
                            state.status = 'loading'
                            state.loading = true
                        })
                    .addCase(addTeam.fulfilled, (state, action) => {
                                state.status = 'succeeded'
                                if (!state.teams) {
                                    state.teams = [];  
                                }
                                state.teams.push(action.payload)
                                state.loading = false
                        })
                    .addCase(addTeam.rejected, (state, action) => {
                                    state.status = 'failed'
                                    state.error = action.payload
                                    state.loading = false
                        })
                    .addCase(deleteTeam.fulfilled,(state,action)=>{
                                    state.teams = state.teams.filter(team=>team.id!==action.payload)
                        })
                    .addCase(updateTeam.pending,(state)=>{
                        state.status ="loading"
                        state.loading=true
                    })
                    .addCase(updateTeam.fulfilled, (state,action)=>{
                        
                        state.loading=false
                        state.teams
                        const updatedTeam =action.payload
                        const index = state.teams.findIndex(team => team.id === updatedTeam.id);
                        if (index !== -1) {
                            state.teams[index] = updatedTeam;
                        }
                    })
                    .addCase(updateTeam.rejected, (state,action)=>{
                        state.status = 'failed';
                        state.loading=false
                        state.error = action.payload

                    })
                    .addCase(partialUpdateTeam.pending, (state) => {
                        state.status = "loading";
                        state.loading = true;
                        })
                        .addCase(partialUpdateTeam.fulfilled, (state, action) => {
                            state.status = "succeeded";
                            state.loading = false;

                            const updatedTeam = action.payload?.team; // safe access
                            if (!updatedTeam) return;

                            const index = state.teams.findIndex(team => team.id === updatedTeam.id);
                            if (index !== -1) {
                                state.teams[index] = updatedTeam;
                            }
                            })

                        .addCase(partialUpdateTeam.rejected, (state, action) => {
                        state.status = "failed";
                        state.loading = false;
                        state.error = action.payload;
                        })        
                        }
                        })
    


export default teamsSlice.reducer;

