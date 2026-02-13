import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, createBrowserRouter,useNavigate } from 'react-router-dom'
import Home from './Pages/Home';
import Login from './Pages/Login';
import { useEffect } from 'react';
import { fetchAdmin } from './Slices/adminSlice';
import Profile from './Pages/Profile';
import Update from './Pages/Update';
import QuestionLayout from './Pages/QuestionLayout';
import CreateQuestion from './Pages/CreateQuestion';
import UpdateQuestion from './Pages/UpdateQuestion';
import Questions from './Pages/Questions';
import LeaderboardA from './Pages/LeaderboardA';
import LeaderboardB from './Pages/LeaderboardB';
import LeaderboardC from './Pages/LeaderboardC';
import User from './Pages/User';
import ScrollToTop from './Components/ScrollToTop';
import LeaderboardLayout from './Pages/LeaderboardLayout';
import toast from "react-hot-toast";

const App = () => {

  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.admin.isAuthenticated);
  const navigate = useNavigate()

  useEffect(() => {

    dispatch(fetchAdmin()).unwrap()
    .then(() => {

    })
    .catch((e) => {
      
    })

  }, [])

  return (
    <>
      <ScrollToTop />
      {
        isAuth ?

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/update' element={<Update />} />
            <Route path='/q' element={<QuestionLayout />}>
              <Route index element={<Questions />} />
              <Route path='create' element={<CreateQuestion />} />
              <Route path='update/:uid' element={<UpdateQuestion />} />
              <Route path='all-questions' element={<Questions />} />
            </Route>

            <Route path='/leaderboard' element={<LeaderboardLayout />}>
              <Route index element={<LeaderboardA />} />
              {/* <Route path='high-score' element={<LeaderboardA />} /> */}
              <Route path='total-score' element={<LeaderboardB />} />
              <Route path='highest-attempts' element={<LeaderboardC />} />
            </Route>

            <Route path='/u/:userId' element={<User />} />
            <Route path='*' element={<Home />} />
          </Routes>
          :
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Login />} />
            <Route path='/update' element={<Login />} />
            <Route path='/leaderboard' element={<Login />}>
              <Route index element={<Login />} />
              {/* <Route path='high-score' element={<LeaderboardA />} /> */}
              <Route path='total-score' element={<Login />} />
              <Route path='highest-attempts' element={<Login />} />
            </Route>
            <Route path='/u/:userId' element={<Login />} />
            <Route path='*' element={<Login />} />
          </Routes>
      }
    </>
  )
}

export default App
