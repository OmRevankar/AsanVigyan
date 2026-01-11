import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import {toast} from 'react-hot-toast'
import { BACKEND_URL } from "../../../client/src/Helper/constants";

const initialState = {
    adminData : {},
    isLoading : true,
    isAuthenticated : false
};

//login
//fetch
//update
//logout

export const loginAdmin = createAsyncThunk(
    '/admin/login',

    async (data , {rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/admin/login`,{
                method : "POST",
                credentials : "include",
                body : JSON.stringify(data),
                headers: {
                    'Content-Type' : "application/json"
                }
            });

            const response = await resp.json();
            console.log(response);

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to login");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to login");
        }
    }
);

export const fetchAdmin = createAsyncThunk(
    '/admin/fetch',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/admin/fetch`,{
                method : "GET",
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to fetch Admin");

            return response;

        } catch (error) {
            return rejectWithValue(response.message || "Failed to fetch Admin");

        }
    }
);

export const logoutAdmin = createAsyncThunk(
    '/admin/logout',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/admin/logout`,{
                method : "POST",
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to logout User");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to logout User");
        }
    }
)

const adminSlice = createSlice({
    name : "admin",
    initialState,
    reducers : {},
    extraReducers : (builder)=> {
        builder
        .addCase(fetchAdmin.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchAdmin.rejected , (state,action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            console.error(action.payload);
        })
        .addCase(fetchAdmin.fulfilled , (state,action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.adminData = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(loginAdmin.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(loginAdmin.rejected , (state,action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            console.error(action.payload);
        })
        .addCase(loginAdmin.fulfilled , (state,action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.adminData = action.payload.data;
            toast.success(action.payload.message);
        })

        .addCase(logoutAdmin.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(logoutAdmin.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(logoutAdmin.fulfilled , (state,action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.adminData = {};
            toast.success(action.payload.message);
        })
    }
});

export default adminSlice.reducer;