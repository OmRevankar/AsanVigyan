import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../Slices/userSlice.jsx'

export const store = configureStore({
    reducer : {
        user : userReducer
    }
})