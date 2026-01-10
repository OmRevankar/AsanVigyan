import React from 'react'
import LeaderboardHead from '../Components/LeaderboardHead'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { totalAttempts } from '../Slices/leaderboardSlice';

const LeaderboardC = () => {

  const dispatch = useDispatch();
  const leaderboard = useSelector(state => state.leaderboard.totalAttempts);

  useEffect(()=>{

    dispatch(totalAttempts());

  }
  ,[])

  return (
    <div>
        <LeaderboardHead />

        <div>{

        leaderboard.map((item, index) => {

          return (
            <div className='flex flex-row gap-5'>

              <div>{item.username}</div>
              <div>{item.attempts}</div>

            </div>
          )

        })

      }</div>
           
    </div>
  )
}

export default LeaderboardC
