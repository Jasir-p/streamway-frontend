import { createSlice } from "@reduxjs/toolkit";

const initialState = {role:null, permissions:[]}


const authrizeSlice = createSlice({ name:"auth",
    initialState,
    reducers:{
        setUserRoleAndPermissions: (state, action) => {
            state.role = action.payload.role;
            state.permissions = action.payload.permissions;
            state.isAuthenticated =true
          },
          clearAuth: (state) => {
            state.role = null;
            state.permissions = [];
            state.isAuthenticated =false
          },
    }
}
)

export const{setUserRoleAndPermissions,clearAuth}= authrizeSlice.actions
export default authrizeSlice.reducer;