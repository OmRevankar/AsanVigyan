import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import LeaderboardNavbar from '../Components/LeaderboardNavbar'
import { useDispatch, useSelector } from 'react-redux'
import { totalScore } from '../Slices/leaderboardSlice'
import { NavLink } from 'react-router-dom'

const LeaderboardB = () => {

    const dispatch = useDispatch();
    const data = useSelector(state => state.leaderboard.totalScore);
    console.log(data);

    useEffect(() => {

        dispatch(totalScore());

    }, [])

    return (
        <div>
            <Navbar />
            <LeaderboardNavbar />

            <div>
                <div className='flex flex-row gap-5'>
                    <div>User</div>
                    <div>Total Score</div>
                </div>
                {
                    data.map((item, i) => {
                        return (
                            <div className='flex flex-row gap-10'>
                                <NavLink to={`/u/${item._id}`}>{item.username}</NavLink >
                                <div>{item.lifeTimeScore}</div>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}

export default LeaderboardB
