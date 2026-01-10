import React from 'react'
import LeaderboardHead from '../Components/LeaderboardHead'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { totalScore } from '../Slices/leaderboardSlice';

const LeaderboardB = () => {

  const dispatch = useDispatch();
  const leaderboard = useSelector(state => state.leaderboard.totalScore);

  useEffect(()=>{

    dispatch(totalScore());

  }
  ,[])

  return (
    <div>
      <LeaderboardHead />

      <div>{
      
        leaderboard.map((item,index) => {

          return (
            <div className='flex flex-row gap-10'>
              <div>{item.uid}</div>
              <div>{item.username}</div>
              <div>{item.lifeTimeScore}</div>
            </div>
          )

        })
        
      }</div>

    </div>
  )
}

export default LeaderboardB
