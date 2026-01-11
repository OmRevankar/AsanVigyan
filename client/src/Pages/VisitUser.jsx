import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchOtherUser } from '../Slices/otheruserSlice';

const VisitUser = () => {

    const {userId} = useParams();
    const userData = useSelector(state => state.otheruser.userData);

    console.log(userData);

    const dispatch = useDispatch();

    const formatDOB = (dob) => {
    if (!dob) return 'N/A';

    const date = new Date(dob);

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: "numeric"
    })
  }

    useEffect(() => {

      dispatch(fetchOtherUser({userId}));

    },[])

  return (
    <div>
      {/* <div>{userId}</div> */}
      
      <div>
        <img src={userData.profileImage} alt="" className='size-24' />

        <div>Username : {userData.username}</div>
        <div>Full Name : {userData.fullName}</div>
        <div>Date of Birth : {formatDOB(userData.dob)}</div>
        <div>High Score : {userData.highScore}</div>
        <div>Total Score : {userData.totalScore}</div>
        <div>Total Tests Taken : {userData.totalAttempts}</div>
      </div>
    </div>
  )
}

export default VisitUser
