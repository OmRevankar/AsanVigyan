import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../Helper/constants.js";
import {toast} from 'react-hot-toast'

const initialState = {
    userData : {},
    isLoading : true,
};

const errorSt = ["Access token absent in browser","Expired Access token present in browser","Expired Access token present in Browser : TokenExpiredError :)","Token present in Browser but undefined"];

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
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(fetchUser.fulfilled , (state,action) => {
            state.isLoading = true;
            state.userData = action.payload.data[0];
            // toast.success(action.payload.message);
        })
    }
});

export default userSlice.reducer;