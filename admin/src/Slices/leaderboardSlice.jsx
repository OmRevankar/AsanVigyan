import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../Helper/constants";


const initialState = {
    highScore : [] ,
    totalScore : [] ,
    totalAttempts : [] ,
    isLoading : true
};

const errorSt = ["Access token absent in browser","Expired Access token present in browser","Expired Access token present in Browser : TokenExpiredError :)","Token present in Browser but undefined"];

export const highScore = createAsyncThunk(
    '/leaderboard/high-score',

    async (_,{rejectWithValue}) => {

        try {
            
            const resp = await fetch(`${BACKEND_URL}/leaderboard/high-score-ad`,{
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
            
            const resp = await fetch(`${BACKEND_URL}/leaderboard/total-score-ad`,{
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
            
            const resp = await fetch(`${BACKEND_URL}/leaderboard/total-attempts-ad`,{
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