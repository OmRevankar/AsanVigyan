import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
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
          <Route path='/update' element={<Update />} />
          <Route path='/q' element={<QuestionLayout />}>
            <Route path='create' element={<CreateQuestion />} />
            <Route path='update/:uid' element={<UpdateQuestion />} />
            <Route path='all-questions' element={<Questions />} />
          </Route>
          <Route path='*' element={<Home />} />
        </Routes>
        : 
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Login />} />
          <Route path='/update' element={<Login />} />
          <Route path='*' element={<Login />} />
        </Routes>
      }
    </Router>
  )
}

export default App
