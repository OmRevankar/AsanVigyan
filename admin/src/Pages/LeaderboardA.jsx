import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import LeaderboardNavbar from '../Components/LeaderboardNavbar'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { highScore } from '../Slices/leaderboardSlice'

const LeaderboardA = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector(state => state.leaderboard.highScore);
  console.log(data);

  useEffect(() => {

    dispatch(highScore())

  },[])

  return (
    <div>
        <Navbar />
        <LeaderboardNavbar />

        <div>
            <div className='flex flex-row gap-5'>
                <div>User</div>
                <div>High Score</div>
            </div>
            
            {
                data.map((item,i) => {
                    return (
                        <div className='flex flex-row gap-10'>
                            <NavLink to={`/u/${item.userId}`}>{item.username}</NavLink>
                            <div>{item.score}</div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default LeaderboardA
