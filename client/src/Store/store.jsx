import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../Slices/userSlice.jsx'
import testReducer from '../Slices/testSlice.jsx'

export const store = configureStore({
    reducer : {
        user : userReducer,
        test : testReducer
    }
})