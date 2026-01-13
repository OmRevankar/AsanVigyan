import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

  const userData = useSelector(state => state.user.userData);

  return (
    <div className='flex flex-row justify-center gap-10 p-2 bg-amber-300'>
      <div>
        <NavLink to='/' className={({isActive}) => isActive ? 'hidden' : 'block'}>Home</NavLink>
      </div>
      <NavLink to='/profile' className='self-end' ><img src={userData.profileImage} alt="" className='size-10 rounded-full' /></NavLink>
    </div>
  )
}

export default Navbar
