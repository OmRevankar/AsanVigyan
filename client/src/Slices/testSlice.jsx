import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../Helper/constants";
import toast from "react-hot-toast";


const initialState = {
    testData : {},
    questionData : [],
    testHistory : [],
    isLoading : true
};

const errorSt = ["No access Token present in the Browser => User hasn't logged in","Expired Access token present in Browser","Expired Access token present in Browser : TokenExpiredError :)","Token present in Browser but undefined"]

export const startTest = createAsyncThunk(
    '/test/start',

    async (data,{rejectWithValue}) => {

        try {
            
            const resp = await fetch(`${BACKEND_URL}/test/start`,{
                method : "POST",
                body:JSON.stringify(data),
                credentials : "include",
                headers : {
                    'Content-Type' : 'application/json'
                }
            });

            const response = await resp.json();
            console.log(response);

            if(response.statusCode !== 200)
            {
                return rejectWithValue(response.message || "Failed to fetch questions");
            }

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch questions");
        }

    }
);


export const submitTest = createAsyncThunk(
    '/test/submit',

    async (data,{rejectWithValue}) => {

        try {
            
            const resp = await fetch(`${BACKEND_URL}/test/submit`,{
                method : "POST",
                body : JSON.stringify(data),
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const response = await resp.json();
            console.log(response);

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to submit test");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to submit test");
        }

    }
);

export const fetchUserTestHistory =  createAsyncThunk(
    '/test/fetch-user-test-history',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/test/fetch-user-test-history`,{
                method : "GET",
                credentials : "include"
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

const testSlice = createSlice({
    name : "test",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(startTest.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(startTest.rejected,(state,action) => {
            state.isLoading = false;
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(startTest.fulfilled,(state,action) => {
            state.isLoading = false;
            state.questionData = action.payload.data;
            // toast.success(action.payload.message);
        })

        .addCase(submitTest.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(submitTest.rejected,(state,action) => {
            state.isLoading = false;
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(submitTest.fulfilled,(state,action) => {
            state.isLoading = false;
            state.testData = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(fetchUserTestHistory.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchUserTestHistory.rejected,(state,action) => {
            state.isLoading = false;
            state.testHistory = [];
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(fetchUserTestHistory.fulfilled,(state,action) => {
            state.isLoading = false;
            state.testHistory = action.payload.data;
            // toast.success(action.payload.message);
        })
    }
});

export default testSlice.reducer;