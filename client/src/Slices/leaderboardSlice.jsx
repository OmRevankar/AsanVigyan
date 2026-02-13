import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../Helper/constants";
import toast from "react-hot-toast";

const initialState = {
    highScore : [] ,
    totalScore : [] ,
    totalAttempts : [] ,
    isLoading : true
};

const errorSt = ["No access Token present in the Browser => User hasn't logged in","Expired Access token present in Browser","Expired Access token present in Browser : TokenExpiredError :)","Token present in Browser but undefined"]


export const highScore = createAsyncThunk(
    '/leaderboard/high-score',

    async (_,{rejectWithValue}) => {

        try {
            
            const resp = await fetch(`${BACKEND_URL}/leaderboard/high-score`,{
                method : "GET",
                credentials :"include"
            });

            const response = await resp.json();

            if(response.statusCode != 200)
                return rejectWithValue(response.message || "Failed to fetch leaderboard");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch leaderboard");
        }

    }
);

export const totalScore = createAsyncThunk(
    '/leaderboard/total-score',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/leaderboard/total-score`,{
                method : "GET",
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch leaderboard");

            return response;


        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch leaderboard");   
        }
    }
);

export const totalAttempts = createAsyncThunk(
    '/leaderboard/total-attempts',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/leaderboard/total-attempts`,{
                method : "GET",
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch leaderboard");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch leaderboard");
        }
    }
)

const leaderboardSlice = createSlice({
    name : 'leaderboard',
    initialState,
    reducers : {} ,
    extraReducers : (builder) => {
        builder
        .addCase(highScore.pending , (state,action) => {
            state.isLoading = true
        })
        .addCase(highScore.rejected , (state,action) => {
            state.isLoading = false;
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(highScore.fulfilled , (state,action) => {
            state.isLoading = false;
            state.highScore = action.payload.data;
            // toast.success(action.payload.message);
        })

        .addCase(totalScore.pending , (state,action) => {
            state.isLoading = true
        })
        .addCase(totalScore.rejected , (state,action) => {
            state.isLoading = false;
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(totalScore.fulfilled , (state,action) => {
            state.isLoading = false;
            state.totalScore = action.payload.data;
            // toast.success(action.payload.message);
        })
        .addCase(totalAttempts.pending , (state,action) => {
            state.isLoading = true
        })
        .addCase(totalAttempts.rejected , (state,action) => {
            state.isLoading = false;
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(totalAttempts.fulfilled , (state,action) => {
            state.isLoading = false;
            state.totalAttempts = action.payload.data;
            // toast.success(action.payload.message);
        })
    }
});

export default leaderboardSlice.reducer;