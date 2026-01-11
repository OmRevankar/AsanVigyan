import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminData : {},
    isLoading : true,
    isAuthenticated : false
};



const adminSlice = createSlice({
    name : "admin",
    initialState,
    reducers : {},
    extraReducers : (builder)=> {
        builder
        .addCase()
    }
})