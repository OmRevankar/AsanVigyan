import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../Helper/constants";
import toast from "react-hot-toast";

const initialState = {
    questionData : [],
    singleQuestion : {},
    isLoading : true
};

export const fetchAllQuestions = createAsyncThunk(
    '/question/fetch-all',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/question/fetch-all`,{
                method : "GET",
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch questions");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch questions");

        }
    }
)

export const createQuestion = createAsyncThunk(
    '/question/create',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/question/create`,{
                method : "POST",
                body : data,
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to create question");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to create question");

        }
    }
)

export const updateQuestion = createAsyncThunk(
    '/question/update',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/question/update`,{
                method : "PATCH",
                body : data,
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to update question");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to update question");

        }
    }
)

export const deleteQuestion = createAsyncThunk(
    '/question/delete',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/question/delete`,{
                method : "DELETE",
                body : JSON.stringify(data),
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to delete question");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to delete question");

        }
    }
)

export const fetchQuestion  = createAsyncThunk(
    '/question/fetch',

    async (data,{rejectWithValue}) =>{
        try {
            
            const resp = await fetch(`${BACKEND_URL}/question/fetch`,{
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data),
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch question");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch question")
        }
    }
)

const questionSlice = createSlice({
    name : 'question',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllQuestions.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchAllQuestions.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(fetchAllQuestions.fulfilled , (state,action) => {
            state.isLoading = false;
            state.questionData = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(createQuestion.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(createQuestion.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(createQuestion.fulfilled , (state,action) => {
            state.isLoading = false;
            state.singleQuestion = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(updateQuestion.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(updateQuestion.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(updateQuestion.fulfilled , (state,action) => {
            state.isLoading = false;
            state.singleQuestion = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(deleteQuestion.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(deleteQuestion.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(deleteQuestion.fulfilled , (state,action) => {
            state.isLoading = false;
            state.singleQuestion = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(fetchQuestion.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchQuestion.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(fetchQuestion.fulfilled , (state,action) => {
            state.isLoading = false;
            state.singleQuestion = action.payload.data;
            toast.success(action.payload.message);
        })
    }
});

export default questionSlice.reducer;