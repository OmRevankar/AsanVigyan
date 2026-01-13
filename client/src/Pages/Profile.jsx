import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserTestHistory } from '../Slices/testSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../Slices/userSlice';
import {X,OctagonMinus,Check} from 'lucide-react'
import Navbar from '../Components/Navbar';

const LogoutDialogue = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutUser())
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

  const [isOpen, setIsOpen] = useState(false);

  const userData = useSelector(state => state.user.userData);
  const testHistory = useSelector(state => state.test.testHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(userData);
  console.log(testHistory);

  const formatDOB = (dob) => {
    if (!dob) return 'N/A';

    const date = new Date(dob);

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: "numeric"
    })
  }

  const formatTime = (time) => {

    if(!time)
      return "N/A";

    const date = new Date(time);

    return date.toLocaleString(undefined,{
      hour : "numeric",
      minute : "2-digit",
      hour12 : true
    })

  }

  useEffect(() => {

    dispatch(fetchUserTestHistory());

  }, [])

  return (
    <div>
      <Navbar />
      <div>
        <img src={userData.profileImage} alt="" className='size-24' />

        <div>Username : {userData.username}</div>
        <div>Full Name : {userData.fullName}</div>
        <div>Date of Birth : {formatDOB(userData.dob)}</div>
        <div>High Score : {userData.highScore}</div>
        <div>Total Score : {userData.totalScore}</div>
        <div>Total Tests Taken : {userData.totalAttempts}</div>
      </div>

      <div onClick={() => {setIsOpen(!isOpen)}} className='my-5 cursor-pointer'>Logout</div>

      <div onClick={() => {navigate('/update')}} className='my-5 cursor-pointer'>Update Profile</div>


      <div className='mt-3 flex flex-col gap-7 mx-5'>
        {
          testHistory.map((test, i) => {
            return (
              <div className='border-2'>

                <div className='flex flex-row gap-5 border-b-2'>
                  <div>{i + 1}. </div>
                  <div>UID : {test.uid}</div>
                  <div>{formatDOB(test.createdAt)}</div>
                  <div>{formatTime(test.createdAt)}</div>
                  <NavLink to={`/u/${test.userId}`}>Taken By : {test.fullName}</NavLink>
                  <div>Score : {test.score}</div>
                </div>

                <div className='flex flex-col gap-3 mt-5'>
                  {
                    test.responses.map((qn, j) => {
                      return (
                        <div className='border-cyan-100 border-2'>

                          <div className={qn.status === 'unattempted' ? `flex flex-row gap-3 bg-amber-200` : `flex flex-row gap-3`}>
                            <div>{j + 1}.</div>
                            <div>{qn.question.description}</div>
                            <div>UID : {qn.uid}</div>
                            <div>{qn.score}/{qn.question.value}</div>
                            <div>{qn.status === "correct" ? <Check size={18} color='green' /> : (qn.status === "incorrect" ? <X size={18} color='red' /> : <OctagonMinus size={18} color='brown' />)}</div>
                            <div className='font-italic'>{qn.status}</div>
                          </div>

                          <div>
                            {
                              qn.question.options.map((opt, k) => {
                                return (
                                  <div className={((qn.selectedOption === opt.id && opt.id === qn.question.correctOption) || opt.id === qn.question.correctOption) ? `flex flex-row gap-5 bg-green-400` : (qn.selectedOption === opt.id && opt.id !== qn.question.correctOption) ? `flex flex-row gap-5 bg-red-400` : `flex flex-row gap-5`}>
                                    <div>{opt.id}</div>
                                    <div>{opt.text}</div>
                                  </div>
                                )
                              })
                            }
                          </div>

                        </div>
                      )
                    })
                  }
                </div>

              </div>
            )
          })
        }
      </div>

      <div>
        <LogoutDialogue isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
    </div>
  )
}

export default Profile
