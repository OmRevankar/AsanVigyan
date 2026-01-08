import React, { useEffect, useState } from 'react'
import Register from './Pages/Register.jsx'
import Login from './Pages/Login.jsx'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Game from './Pages/Game.jsx'
import LeaderboardA from './Pages/LeaderboardA.jsx'
import LeaderboardC from './Pages/LeaderboardC.jsx'
import LeaderboardB from './Pages/LeaderboardB.jsx'

const App = () => {

  const [loggedIn,setLoggedIn] = useState(false);

  useEffect(() => {

    let ld = localStorage.getItem("isLoggedIn");

    if(ld)
      setLoggedIn(ld);
    else
      setLoggedIn(false);

  }, [])
  

  return (
    <Router>

      {
        loggedIn ? 

        <Routes>

          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Home />}/>
          <Route path='/register' element={<Home />}/>
          <Route path='/game' element={<Game />}/>
          <Route path='/leaderboard-a' element={<LeaderboardA />}/>
          <Route path='/leaderboard-b' element={<LeaderboardB />}/>
          <Route path='/leaderboard-c' element={<LeaderboardC />}/>
  
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

        </Routes>
      }

    </Router>
  )
}

export default App
