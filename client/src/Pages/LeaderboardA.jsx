import React from 'react'
import LeaderboardHead from '../Components/LeaderboardHead'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { highScore } from '../Slices/leaderboardSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const LeaderboardA = () => {

  const dispatch = useDispatch();
  const leaderboard = useSelector(state => state.leaderboard.highScore);
  const user = useSelector(state => state.user.userData);
  const navigate = useNavigate();
  console.log(leaderboard);

  useEffect(() => {

    dispatch(highScore());


  }, [])


  return (
    <div>
      <Navbar />
      <LeaderboardHead />

      <div>{

        leaderboard.map((item, index) => {

          return (
            <div className='flex flex-row gap-5'>

              <div>{item.uid}</div>
              <div onClick={() => {item.userId === user._id ? navigate(`/profile`) :  navigate(`/u/${item.userId}`)}}>{item.username}</div>
              <div>{item.score}</div>

            </div>
          )

        })

      }</div>
    </div>
  )
}

export default LeaderboardA
