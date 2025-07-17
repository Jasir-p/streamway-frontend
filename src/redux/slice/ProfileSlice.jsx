import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id :null,
    name: null,
    email: null,
    phone: null,
    role: null,
    company: null,
    joined_date: null,
    status: 'idle'
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile(state, action) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone||action.payload.contact_number;
            state.role = action.payload.role;
            state.company = action.payload.company;
            state.joined_date = action.payload.joined_date ||action.payload.joined ;
            state.status = 'succeeded';
        },
        updateProfile(state, action) {
            
            return {
                ...state,
                ...action.payload,
                status: 'succeeded'
            };
        },
        setLoadingStatus(state) {
            state.status = 'loading';
        },
        setErrorStatus(state) {
            state.status = 'failed';
        }
    }
});

export const { setProfile, updateProfile, setLoadingStatus, setErrorStatus } = profileSlice.actions;
export default profileSlice.reducer;