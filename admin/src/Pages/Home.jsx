import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAll } from '../Slices/testSlice';
import { Check, OctagonMinus, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Home = () => {

  const dispatch = useDispatch();
  const testHistory = useSelector(state => state.test.testHistory);
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

    dispatch(fetchAll());

  }, [])

  return (
    <div>
      <Navbar />
      Home Page
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
    </div>
  )
}

export default Home
