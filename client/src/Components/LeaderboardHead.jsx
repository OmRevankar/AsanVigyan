import React from 'react'
import {NavLink} from 'react-router-dom'

const LeaderboardHead = () => {
  return (
    <div className='flex flex-row gap-10'>
      <NavLink to='/leaderboard-a'>High Score</NavLink>
      <NavLink to='/leaderboard-b'>Total Score</NavLink>
      <NavLink to='/leaderboard-c'>Highest Attempts</NavLink>
    </div>
  )
}

export default LeaderboardHead
