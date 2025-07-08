import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";




// Fetch roles from API
export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {

const response = await subdomainInterceptors.get("/role/");
  return response.data;
});



export const addRole = createAsyncThunk("roles/addRole", async (roleData, { rejectWithValue }) => {
  try {


    const response = await subdomainInterceptors.post('/role/', 
      roleData,
    );

    return response.data; // Return the newly created role
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error adding role");
  }
});
export const updateRole = createAsyncThunk("roles/updateRole", async (roleData, { rejectWithValue }) => {
  try {
    const role_id = roleData.id;
    const response = await subdomainInterceptors.put("/role/", roleData, {
      params: { role_id }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating role");
  }
});

export const deleteRole = createAsyncThunk("roles/deleteRole", async (role_id, { rejectWithValue}
  ) => {
    try {
      const subdomain = localStorage.getItem("subdomain");
      const token = localStorage.getItem("access_token");
      const response = await axios.delete(`https://api.streamway.solutions/${subdomain}/role/`, {
        params: { role_id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      
      return rejectWithValue(error.response?.data || error.message);
    }
  })


const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles;
        
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addRole.pending,(state)=>{
        state.loading =true
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        const newRole = action.payload;
        
        
        if (newRole.parent_role) {
            const addRoleToTree = (roles) => {
                return roles.map(role => {
                    if (role.id === newRole.parent_role) {
                        return { ...role, children: [...(role.children || []), newRole] };
                    } else if (role.children) {
                        return { ...role, children: addRoleToTree(role.children) };
                    }
                    return role;
                });
            };
    
            state.roles = addRoleToTree(state.roles);
        } else {
          
            state.roles.push(newRole);
        }
    })
    
      .addCase(addRole.rejected,(state,action)=>{
        state.loading=false
        state.error=action.payload
      })
      .addCase(updateRole.fulfilled, (state,action)=>{
        state.loading=false
        const updatedRole = action.payload
        
        const updatedRoles = (roles)=>{
          return roles.map(role=>{
            if (role.id===updatedRole.id){
              return {...role,...updatedRole}
              }
              else if(role.children){
                return {...role,children:updatedRoles(role.children)}
                }
                return role
                })
        }

      })
      .addCase(updateRole.pending, (state)=>{
        state.loading = true

      })
      .addCase(updateRole.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload
      }).addCase(deleteRole.pending, (state)=>{
        state.loading = true
        
      }).addCase(deleteRole.fulfilled, (state,action)=>{
        state.loading=false
        state.roles = state.roles.filter(role=>role.id !== action.payload.id)
        }).addCase(deleteRole.rejected, (state,action)=>{
          state.loading=false
          state.error=action.payload

      })
      
  },
});

export default roleSlice.reducer;
