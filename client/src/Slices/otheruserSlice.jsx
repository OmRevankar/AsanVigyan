import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../Helper/constants";
import toast from "react-hot-toast";

const initialState = {
    userData : {},
    isLoading : true
};

const errorSt = ["No access Token present in the Browser => User hasn't logged in","Expired Access token present in Browser","Expired Access token present in Browser : TokenExpiredError :)","Token present in Browser but undefined"]

export const fetchOtherUser = createAsyncThunk(
    '/otheruser/fetch',

    async (data , {rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/user/fetch-other-user`,{
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data),
                headers : {
                    'Content-Type' : 'application/json'
                }
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch user data");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch user data");
        }
    }
)

const otheruserSlice = createSlice({
    name : 'otheruser',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchOtherUser.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchOtherUser.rejected , (state,action) => {
            state.isLoading = false;
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(fetchOtherUser.fulfilled , (state,action) => {
            state.isLoading = false;
            state.userData = action.payload.data[0];
            // toast.success(action.payload.message);
        })
    }
})

export default otheruserSlice.reducer;