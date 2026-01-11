import React from 'react'
import LeaderboardHead from '../Components/LeaderboardHead'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { totalAttempts } from '../Slices/leaderboardSlice';
import { useNavigate } from 'react-router-dom';

const LeaderboardC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leaderboard = useSelector(state => state.leaderboard.totalAttempts);
  // console.log(leaderboard);

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

              <div onClick={() => {navigate(`/u/${item._id}`)}}>{item.username}</div>
              <div>{item.attempts}</div>

            </div>
          )

        })

      }</div>
           
    </div>
  )
}

export default LeaderboardC
