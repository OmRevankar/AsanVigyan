import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BACKEND_URL } from '../Helper/constants';
import toast from 'react-hot-toast';

const initialState = {
    userData : {},
    isLoading : false,
    isAuthenticated : false
};

const errorSt = ["No access Token present in the Browser => User hasn't logged in","Expired Access token present in Browser","Expired Access token present in Browser : TokenExpiredError :)","Token present in Browser but undefined"]

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

export const fetchUser = createAsyncThunk(
    '/user/fetch',

    async (_, {rejectWithValue}) => {

        try {
            
            const resp = await fetch(`${BACKEND_URL}/user/fetch`,{
                method : "GET",
                credentials : "include"
            });

            const response = await resp.json();

            //no token present, expired token , or some error
            if(response.statusCode !== 200)
            {
                return rejectWithValue(response.message || "Failed to Fetch User Details");
            }

            return response;
            

        } catch (error) {
            return rejectWithValue(error.message || "Failed to Fetch User Details");
        }

    }
);

export const updateUser = createAsyncThunk(
    '/user/update',

    async (data,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/user/update`,{
                method : "PATCH",
                body : data,
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to update user");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to update user");
        }
    }
);

export const logoutUser = createAsyncThunk(
    '/user/logout',

    async (_,{rejectWithValue}) => {
        try {
            
            const resp = await fetch(`${BACKEND_URL}/user/logout`,{
                method : "POST",
                credentials : "include"
            });

            const response = await resp.json();

            if(response.statusCode !== 200)
                return rejectWithValue(response.message || "Failed to Logout user");

            return response;

        } catch (error) {
            return rejectWithValue(error.message || "Failed to Logout user");
        }
    }
)

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
            state.userData = action.payload.data.user;
            // localStorage.setItem("isLoggedIn","true");
            state.isAuthenticated = true;
            toast.success(action.payload.message || "Successfully Logged In")
        })

        .addCase(fetchUser.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchUser.rejected , (state,action) => {
            state.isLoading = false;
            state.userData = {};
            // localStorage.setItem("isLoggedIn","false");
            state.isAuthenticated = false;
        })
        .addCase(fetchUser.fulfilled , (state,action) => {
            state.isLoading = false;
            state.userData = action.payload.data[0];
            // localStorage.setItem("isLoggedIn", "true");
            state.isAuthenticated = true
            toast.success("User logged in Successfully"||action.payload.message)
        })

        .addCase(updateUser.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(updateUser.rejected , (state,action) => {
            state.isLoading = false;
            if(errorSt.includes(action.payload))
                toast.error("Try to Login Again")
            else
                toast.error(action.payload);
        })
        .addCase(updateUser.fulfilled , (state,action) => {
            state.isLoading = false;
            state.userData = action.payload.data;
            state.isAuthenticated = true;
            toast.success(action.payload.message);
        })

        .addCase(logoutUser.pending , (state,action) => {
            state.isLoading = true;
        })
        .addCase(logoutUser.rejected , (state,action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
        .addCase(logoutUser.fulfilled , (state,action) => {
            state.isLoading = false;
            state.userData = {};
            state.isAuthenticated = false;
            toast.success(action.payload.message);
        })
    }
});

export default userSlice.reducer;