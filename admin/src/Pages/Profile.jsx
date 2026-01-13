import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutAdmin } from '../Slices/adminSlice';
import Navbar from '../Components/Navbar';

const LogoutDialogue = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutAdmin())
    .unwrap()
    .then(() => {
      props.setIsOpen(false);
      navigate('/');
    })
    .catch((e) => {
      props.setIsOpen(false);
      console.error(e);
    })
  }

  if (props.isOpen) {
    return (
      <div className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 bg-yellow-300 border-2 px-10 py-5 cursor-pointer'>
        <div>Are you sure you want to logout</div>

        <div className='flex flex-row justify-around mt-5'>
          <div onClick={() => {logout()}} >Logout</div>
          <div onClick={() => {props.setIsOpen(false)}} >Back</div>
        </div>
      </div>
    )
  }

  return null
}

const Profile = () => {

    const [isOpen,setIsOpen] = useState(false);
    const navigate = useNavigate();

    const adminData = useSelector(state => state.admin.adminData);

    return (
        <div>
            <Navbar />

            <div>
                <img src={adminData.profileImage} alt="" />
                <div>{adminData.fullName}</div>
                <div>{adminData.username}</div>
            </div>

            <div onClick={() => {setIsOpen(true)}} className='bg-yellow-300 w-fit px-2 my-5'>Logout</div>

            <div>
                <LogoutDialogue isOpen={isOpen} setIsOpen={setIsOpen}/>
            </div>
        </div>
    )
}

export default Profile
