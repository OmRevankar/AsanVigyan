import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../Helper/constants.js";
import {toast} from 'react-hot-toast'

const initialState = {
    userData : {},
    isLoading : true,
};

export const fetchUser = createAsyncThunk(
    '/admin/fetch-user',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/user/fetch-user-a`,{
                method : "POST",
                body : JSON.stringify(data),
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch User");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch User");
        }
    }
)

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchUser.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchUser.rejected , (state,action) => {
            state.isLoading = false;
            state.userData = {};
            toast.error(action.payload);
        })
        .addCase(fetchUser.fulfilled , (state,action) => {
            state.isLoading = true;
            state.userData = action.payload.data[0];
            toast.success(action.payload.message);
        })
    }
});

export default userSlice.reducer;