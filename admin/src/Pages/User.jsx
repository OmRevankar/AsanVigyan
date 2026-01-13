import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchUser } from '../Slices/userSlice';
import Navbar from '../Components/Navbar';

const User = () => {

  const { userId } = useParams();

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userData);
  console.log(user);

  const formatDOB = (dob) => {

    const date = new Date(dob);

    return date.toLocaleDateString(undefined,{
      month : 'long',
      year : 'numeric',
      day : "numeric"
    })

  }

  useEffect(() => {

    const data = {
      userId
    }

    dispatch(fetchUser(data))

  }, [])

  return (
    <div>
      <Navbar />
      <div>
        <div className='flex flex-col gap-2'>
          <div>
            <img src={user.profileImage} alt="" className='size-24' />
          </div>
          <div>Full Name : {user.fullName}</div>
          <div>Username : {user.username}</div>
          <div>DOB : {formatDOB(user.dob)}</div>
          <div>Highest Score  : {user.highScore}</div>
          <div>Total Score : {user.totalScore}</div>
          <div>Total Tests Taken : {user.totalAttempts}</div>
        </div>
      </div>
    </div>
  )
}

export default User
