import React from 'react'
import {useNavigate} from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-10 items-center justify-center'>
      <button onClick={() => {navigate('/leaderboard-a')}}>Leaderboard</button>

      <button onClick={() => {navigate('/game')}}>Take Test</button>
    </div>
  )
}

export default Home
