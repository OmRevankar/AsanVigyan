import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchUser } from '../Slices/userSlice';
import Navbar from '../Components/Navbar';
import { fetchUserTestHistory } from '../Slices/testSlice';
import {Check, OctagonMinus, X} from 'lucide-react'

const User = () => {

  const { userId } = useParams();

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userData);
  const testHistory = useSelector(state => state.test.userTestHistory);
  console.log(testHistory);

  const formatDOB = (dob) => {

    const date = new Date(dob);

    return date.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
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

    const data = {
      userId
    }

    dispatch(fetchUser(data));
    dispatch(fetchUserTestHistory(data));

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

      <div className='text-lg mt-10 mx-5'>Test History</div>
      <div className='mt-3 flex flex-col gap-7 mx-5'>
        {
          testHistory.map((test, i) => {
            return (
              <div className='border-2'>

                <div className='flex flex-row gap-5 border-b-2'>
                  <div>{i+1}. </div>
                  <div>UID : {test._id}</div>
                  <div>{formatDOB(test.createdAt)}</div>
                  <div>{formatTime(test.createdAt)}</div>
                  <div>Score : {test.score}</div>
                </div>

                <div className='flex flex-col gap-3 mt-5'>
                  {
                    test.responses.map((qn, j) => {
                      return (
                        <div className='border-cyan-100 border-2'>

                          <div className={qn.status === 'unattempted' ? `flex flex-row gap-3 bg-amber-200` : `flex flex-row gap-3`}>
                            <div>{j+1}.</div>
                            <div>{qn.question.description}</div>
                            <div>UID : {qn.uid}</div>
                            <div>{qn.score}/{qn.question.value}</div>
                            <div>{qn.status === "correct" ? <Check size={18} color='green'/> : (qn.status === "incorrect" ? <X size={18} color='red' /> :  <OctagonMinus size={18} color='brown'/>)}</div>
                            <div className='font-italic'>{qn.status}</div>
                          </div>

                          <div>
                            {
                              qn.question.options.map((opt,k) => {
                                return (
                                  <div className={((qn.selectedOption === opt.id && opt.id === qn.question.correctOption) || opt.id === qn.question.correctOption ) ? `flex flex-row gap-5 bg-green-400` :  (qn.selectedOption === opt.id && opt.id !== qn.question.correctOption) ? `flex flex-row gap-5 bg-red-400` : `flex flex-row gap-5`}>
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

    </div>
  )
}

export default User
