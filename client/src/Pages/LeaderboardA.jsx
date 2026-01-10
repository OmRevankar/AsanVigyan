import React from 'react'
import LeaderboardHead from '../Components/LeaderboardHead'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { highScore } from '../Slices/leaderboardSlice';

const LeaderboardA = () => {

  const dispatch = useDispatch();
  const leaderboard = useSelector(state => state.leaderboard.highScore);

  useEffect(() => {

    dispatch(highScore());

  }, [])


  return (
    <div>

      <LeaderboardHead />

      <div>{

        leaderboard.map((item, index) => {

          return (
            <div className='flex flex-row gap-5'>

              <div>{item.uid}</div>
              <div>{item.username}</div>
              <div>{item.score}</div>

            </div>
          )

        })

      }</div>
    </div>
  )
}

export default LeaderboardA
