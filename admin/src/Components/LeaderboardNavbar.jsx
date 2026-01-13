import React from 'react'
import { NavLink } from 'react-router-dom'

const LeaderboardNavbar = () => {
  return (
    <div className='flex flex-row gap-5 justify-center'>
      <NavLink to='/leaderboard-a'>Highest Score</NavLink>
      <NavLink to='/leaderboard-b'>Total Score</NavLink>
      <NavLink to='/leaderboard-c'>Highest Attempts</NavLink>
    </div>
  )
}

export default LeaderboardNavbar
