import { configureStore } from "@reduxjs/toolkit";

import adminReducer from '../Slices/adminSlice.jsx'
import userReducer from '../Slices/userSlice.jsx'
import questionReducer from '../Slices/questionSlice.jsx'

export const store = configureStore({
    reducer : {
        admin : adminReducer,
        user : userReducer,
        question : questionReducer
    }
});

