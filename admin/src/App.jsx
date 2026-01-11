import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from './Pages/Home';

const App = () => {

  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.admin.isAuthenticated);

  return (
    <Router>
      {
        isAuth ? 

        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
        : 
        <Routes>

        </Routes>
      }
    </Router>
  )
}

export default App
