import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import subdomainInterceptors from "../../Intreceptors/getSubdomainInterceptors";
import { data } from "react-router-dom";



export const fetchFields = createAsyncThunk ( 'field/fetchFields', async (_,{rejectWithValue}) => {
    const subdomain = localStorage.getItem("subdomain")
    const token = localStorage.getItem("access_token")
    try{
    const response = await axios.get(`http://${subdomain}.localhost:8000/api/formfield/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }catch(error){
        return rejectWithValue(error.message)
    }
});

export const addField = createAsyncThunk ( 'field/addField', async (data,{rejectWithValue}) => {
    const subdomain = localStorage.getItem("subdomain")
    const token = localStorage.getItem("access_token")
    try{
        const response = await axios.post(`http://${subdomain}.localhost:8000/api/formfield/
            `, data, {
                headers: { Authorization: `Bearer ${token}` },
                });
                return response.data;
                }catch(error){
                    return rejectWithValue(error.message)
                    }
                    });

export const updateField = createAsyncThunk ( 'field/updateField', async (data, { rejectWithValue }) => {
    try{
        const response = await subdomainInterceptors.put("/api/formfield/",data)
        return response.data
    }catch(error){
        return  rejectWithValue(error.message);

    }
})


export const deleteField = createAsyncThunk ( 'field/deleteField', async (id,{rejectWithValue})=> {
   
    try{
        const response = await subdomainInterceptors.delete("/api/formfield/",
            {data:  { "field_id": id }}
        )
        return response.data
    }
    catch (error){
        return rejectWithValue(error.message)
        }
    })

const fieldSlice = createSlice({
    name: 'fields',
    initialState: {
        field: [],
        loading:false,
        error: null
        },
        reducers: {},
        extraReducers: (builder) => {
            builder
            .addCase(fetchFields.pending, (state, action) => {
                state.loading= true
                })
                .addCase(fetchFields.fulfilled, (state, action) => {
                    state.field = action.payload
                    state.loading = false
                    })
                    .addCase(fetchFields.rejected, (state, action) => {
                        state.error = action.payload
                        state.loading = false
                        })
                        .addCase(addField.pending, (state, action) => {
                            state.loading = true
                            })
                            .addCase(addField.fulfilled, (state, action) => {
                                state.field = Array.isArray(action.payload)? action.payload : []
                                state.loading = false
                                })
                                .addCase(addField.rejected, (state, action) => {
                                    state.error = action.payload
                                    state.loading = false
                                    })

                        }
                    })

export default fieldSlice.reducer;




