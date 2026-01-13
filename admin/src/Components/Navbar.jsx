import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

    const adminData = useSelector(state => state.admin.adminData);

    return (
        <div className='flex flex-row justify-between px-10'>
            <div>AsanVigyan</div>

            <div className='flex flex-row gap-5'>
                <NavLink to='/'>Test History</NavLink>
                <NavLink to='/q/all-questions'>Questions</NavLink>
                <NavLink to='/leaderboard-a' >Leaderboard</NavLink>
            </div>

            <NavLink to='/profile'>{adminData.profileImage ? <img src={adminData.profileImage} alt="" className='size-10 rounded-full'/> : <div>Profile</div> }</NavLink>
        </div>
    )
}

export default Navbar
