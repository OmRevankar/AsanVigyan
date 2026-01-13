import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../Helper/constants";
import toast from "react-hot-toast";


const initialState = {
    testHistory : [],
    userTestHistory : [],
    testData : {},
    isLoading : true
};

export const fetchUserTestHistory =  createAsyncThunk(
    '/test/fetch-user-test-history',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/test/fetch-user-test-history-ad`,{
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data),
                headers : {
                    "Content-Type" : 'application/json'
                }
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch User Test History");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch User Test History");
        }
    }
);

export const fetchAll = createAsyncThunk(
    '/test/fetch-all',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/test/fetch-all`,{
                method : "GET",
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch test history");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch test history");
        }
    }
);

export const fetchTest = createAsyncThunk(
    '/test/fetch',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/test/fetch-ad`,{
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data),
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch test Details");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch test Details");
        }
    }
);

const testSlice = createSlice({
    name : "test",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchUserTestHistory.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchUserTestHistory.rejected,(state,action) => {
            state.isLoading = false;
            // state.userTestHistory = [];
            toast.error(action.payload);
        })
        .addCase(fetchUserTestHistory.fulfilled,(state,action) => {
            state.isLoading = false;
            state.userTestHistory = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(fetchAll.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchAll.rejected,(state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(fetchAll.fulfilled,(state,action) => {
            state.isLoading = false;
            state.testHistory = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(fetchTest.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchTest.rejected,(state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(fetchTest.fulfilled,(state,action) => {
            state.isLoading = false;
            state.testData = action.payload.data[0];
            toast.success(action.payload.message);
        })
    }
});

export default testSlice.reducer;