import { configureStore } from "@reduxjs/toolkit";

import adminReducer from '../Slices/adminSlice.jsx'
import userReducer from '../Slices/userSlice.jsx'
import questionReducer from '../Slices/questionSlice.jsx'
import leaderboardReducer from '../Slices/leaderboardSlice.jsx'
import testReducer from '../Slices/testSlice.jsx'

export const store = configureStore({
    reducer : {
        admin : adminReducer,
        user : userReducer,
        question : questionReducer,
        leaderboard : leaderboardReducer,
        test : testReducer
    }
});

