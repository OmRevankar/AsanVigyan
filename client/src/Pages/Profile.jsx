import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserTestHistory } from '../Slices/testSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../Slices/userSlice';

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

  useEffect(() => {

    dispatch(fetchUserTestHistory());

  }, [])

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

      <div onClick={() => {setIsOpen(!isOpen)}} className='my-5 cursor-pointer'>Logout</div>


      <div className='flex flex-col gap-5 mx-5 mt-5 '>
        {

          testHistory.map((test, index) => {
            return (
              <div className='flex flex-col gap-2 border-2'>
                <div className='flex flex-row gap-10 border-b-2'>
                  <div>Test ID : {test._id}</div>
                  <div>Taken At : {formatDOB(test.createdAt)}</div>
                  <div>Score : {test.score}</div>
                </div>

                <div className='flex flex-col gap-3'>
                  {
                    test.responses.map((item) => {

                      if (item.status !== "unattempted") {
                        return (
                          <div className='border-indigo-300 border-1'>
                            <div>{item.question.description}</div>

                            <div className='flex flex-col gap-1'>
                              {
                                item.question.options.map((opt) => {
                                  return (
                                    <div className={item.selectedOption == opt.id && item.question.correctOption == opt.id ? `bg-green-300 ` : item.selectedOption == opt.id && item.question.correctOption != opt.id ? `bg-red-300` : item.question.correctOption == opt.id ? `bg-green-300` : `bg-white`} >{opt.text}</div>
                                  )
                                })
                              }
                            </div>
                          </div>

                        )
                      }
                    })
                  }
                </div>

              </div>
            );
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
