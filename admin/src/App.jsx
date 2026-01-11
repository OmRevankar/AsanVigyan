import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from './Pages/Home';
import Login from './Pages/Login';
import { useEffect } from 'react';
import { fetchAdmin } from './Slices/adminSlice';
import Profile from './Pages/Profile';

const App = () => {

  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.admin.isAuthenticated);

  useEffect(()=>{

    dispatch(fetchAdmin());

  },[])

  return (
    <Router>
      {
        isAuth ? 

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        : 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Login />} />
        </Routes>
      }
    </Router>
  )
}

export default App
