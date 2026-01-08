import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BACKEND_URL } from '../Helper/constants';
import toast from 'react-hot-toast';

const initialState = {
    userData : {},
    isLoading : false
};

//services
export const registerUser = createAsyncThunk(
    '/user/register',

    async (data,{rejectWithValue}) => {

        try {

            const resp = await fetch(`${BACKEND_URL}/user/register`,{
                method : "POST",
                body:data
            });

            const response = await resp.json();
            console.log(response);

            if(response.statusCode !== 200)
            {
                console.log(response.message)
                return rejectWithValue(response.message || "Registration Failed")
            }

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Registration Failed")
        }

    }
);

export const loginUser = createAsyncThunk(
    '/user/login',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/user/login`,{
                body : JSON.stringify(data),
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json'
                },
                credentials : "include"
            });

            const response = await resp.json();
            console.log(response);

            if(response.statusCode != 200)
            {   console.log(response.message); return rejectWithValue(response.message || "Login Failed"); }

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Login Failed");
        }
    }
);

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(registerUser.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(registerUser.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload)
        })
        .addCase(registerUser.fulfilled , (state,action) => {
            state.isLoading = false;
            toast.success(action.payload.message)
        })

        .addCase(loginUser.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(loginUser.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(loginUser.fulfilled , (state,action) => {
            state.isLoading = false;
            state.userData = action.payload.data;
            localStorage.setItem("isLoggedIn",true);
            toast.success(action.payload.message || "Successfully Logged In")
        })
    }
});

export default userSlice.reducer;