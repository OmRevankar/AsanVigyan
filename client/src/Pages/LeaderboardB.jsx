import React from 'react'
import LeaderboardHead from '../Components/LeaderboardHead'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { totalScore } from '../Slices/leaderboardSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const LeaderboardB = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leaderboard = useSelector(state => state.leaderboard.totalScore);
  const user = useSelector(state => state.user.userData);

  console.log(leaderboard)

  useEffect(()=>{

    dispatch(totalScore());

  }
  ,[])

  return (
    <div>
      <Navbar />
      <LeaderboardHead />

      <div>{
      
        leaderboard.map((item,index) => {

          return (
            <div className='flex flex-row gap-10'>
              <div>{item.uid}</div>
              <div onClick={() => {item._id === user._id ? navigate(`/profile`) :  navigate(`/u/${item._id}`)}}>{item.username}</div>
              <div>{item.lifeTimeScore}</div>
            </div>
          )

        })
        
      }</div>

    </div>
  )
}

export default LeaderboardB
