import React, { useEffect, useState } from 'react'
import Register from './Pages/Register.jsx'
import Login from './Pages/Login.jsx'
import {BrowserRouter as Router , Routes , Route, useNavigate} from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Game from './Pages/Game.jsx'
import LeaderboardA from './Pages/LeaderboardA.jsx'
import LeaderboardC from './Pages/LeaderboardC.jsx'
import LeaderboardB from './Pages/LeaderboardB.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './Slices/userSlice.jsx'
import Update from './Pages/Update.jsx'
import Profile from './Pages/Profile.jsx'

const App = () => {

  const dispatch = useDispatch();
  const authState = useSelector(state => state.user.isAuthenticated);

  useEffect(() => {

    dispatch(fetchUser());

  },[])
  

  return (
    <Router>

      {
        authState ? 

        <Routes>

          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Home />}/>
          <Route path='/register' element={<Home />}/>
          <Route path='/game' element={<Game />}/>
          <Route path='/leaderboard-a' element={<LeaderboardA />}/>
          <Route path='/leaderboard-b' element={<LeaderboardB />}/>
          <Route path='/leaderboard-c' element={<LeaderboardC />}/>
          <Route path='/update' element={<Update />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='*' element={<Home />}/>
  
        </Routes> 

        :

        <Routes>

          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/game' element={<Login />}/>
          <Route path='/leaderboard-a' element={<Login />}/>
          <Route path='/leaderboard-b' element={<Login />}/>
          <Route path='/leaderboard-c' element={<Login />}/>
          <Route path='/update' element={<Login />}/>
          <Route path='/profile' element={<Login />}/>
          <Route path='*' element={<Home />}/>

        </Routes>
      }

    </Router>
  )
}

export default App
