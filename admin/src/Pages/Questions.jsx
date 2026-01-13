import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQuestion, fetchAllQuestions } from '../Slices/questionSlice';
import { Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const DeleteDialogue = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {

        const data = {
            uid : props.seletedQUid
        }

        dispatch(deleteQuestion(data))
        .unwrap()
        .then(() => {
            window.location.reload();
        })
        .catch((e) => {console.error(e)})

    }

    if (props.isOpen === true) {

        return (
            <div className='flex flex-col gap-5 p-5 bg-yellow-300 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'>
                <div>Are you sure you want to delete this Question</div>

                <div className='flex flex-row gap-5'>
                    <div onClick={handleDelete} >YES</div>
                    <div onClick={() => { props.setIsOpen(false) }}>BACK</div>
                </div>
            </div>
        )
    }

    return null;
}

const Questions = () => {

    const dispatch = useDispatch();
    const questionData = useSelector(state => state.question.questionData);

    const [isOpen, setIsOpen] = useState(false);
    const [seletedQUid , setSelectedQUid] = useState();

    useEffect(() => {

        dispatch(fetchAllQuestions())

    }, [])

    return (
        <div>
            {
                questionData.map((qn, i) => {
                    return (
                        <div className='flex flex-col my-6'>
                            <div className='flex flex-row gap-3'>
                                <div>{i+1}. </div>
                                <div>{qn.description}</div>
                                <div>Marks : {qn.value}</div>
                                <div>UID : {qn.uid}</div>
                                <div onClick={() => { setSelectedQUid(qn.uid) ; setIsOpen(true) }}><Trash size={18} /></div>
                            </div>

                            <div>
                                {qn.questionImage ? <img src={qn.questionImage} alt="" className='size-24' /> : <div>No Image for this Question</div>}
                            </div>

                            <div>
                                {
                                    qn.options.map((opt, j) => {
                                        return (
                                            <div className={qn.correctOption === opt.id ? `flex flex-row gap-2 bg-green-200 w-fit` : `flex flex-row gap-2 w-fit`}>
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

            <div>
                <DeleteDialogue isOpen={isOpen} setIsOpen={setIsOpen} seletedQUid={seletedQUid} /> 
            </div>

        </div>
    )
}

export default Questions
