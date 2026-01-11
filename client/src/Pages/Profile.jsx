import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

const Profile = () => {

  const userData = useSelector(state => state.user.userData);
  const dispatch = useDispatch();

  console.log(userData);

  const formatDOB = (dob) => {
    if (!dob) return 'N/A';

    const date = new Date(dob);

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: "numeric"
    })
  }

  useEffect(()=>{

    dispatch()

  },[])

  return (
    <div>
      <div>
        <img src={userData.profileImage} alt="" className='size-24' />

        <div>Username : {userData.username}</div>
        <div>Full Name : {userData.fullName}</div>
        <div>Date of Birth : {formatDOB(userData.dob)}</div>
        <div>High Score : {userData.highScore}</div>
        <div>Total Score : {userData.totalScore}</div>
        <div>Total Tests Taken : {userData.totalAttempts}</div>
      </div>

      <div>
        {

        }
      </div>
    </div>
  )
}

export default Profile
