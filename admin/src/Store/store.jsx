import { configureStore } from "@reduxjs/toolkit";

import adminReducer from '../Slices/adminSlice.jsx'

export const store = configureStore({
    reducer : {
        admin : adminReducer
    }
});

