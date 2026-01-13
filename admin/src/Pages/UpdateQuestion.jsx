import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuestion, updateQuestion } from '../Slices/questionSlice';

const UpdateQuestion = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {uid} = useParams(); 
    const questionData = useSelector(state => state.question.singleQuestion);

    const qnImg = watch('questionImage');
    const previewImage = (qnImg && qnImg.length > 0) ? URL.createObjectURL(qnImg[0]) : questionData.questionImage;

    console.log(questionData)


    const onSubmit = async (data) => {

        const formData = new FormData();

        formData.append('description', data.description);
        formData.append('questionImage', data.questionImage?.[0]);
        formData.append('value', data.value);
        formData.append('correctOption', data.correctOption);
        formData.append('uid', uid);

        const options = [{ id: 1, text: data.option1 }, { id: 2, text: data.option2 }, { id: 3, text: data.option3 }, { id: 4, text: data.option4 }]
        formData.append("options", JSON.stringify(options));

        dispatch(updateQuestion(formData))
            .unwrap()
            .then(() => {
                reset();
                navigate('/');
            })
            .catch((e) => console.error(e))
    }

    useEffect(()=>{

        const body = {uid : uid};
        console.log("HI")
        dispatch(fetchQuestion(body));
        
    },[])

    useEffect(()=>{
        if(questionData)
        {
            const optMap = {};

            questionData.options?.forEach((opt) => {
                optMap[opt.id] = opt.text;
            })

            reset({
                description : questionData.description || "",
                value : questionData.value || "",
                option1 : optMap[1] || "",
                option2 : optMap[2] || "",
                option3 : optMap[3] || "",
                option4 : optMap[4] || "",
                correctOption : questionData.correctOption || ""
            })
        }
            
    },[reset,questionData] )

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div>

                    <label>Description</label>
                    <br />
                    <input type="text" placeholder='Enter Description of Question' {...register('description', {
                        required: { value: true, message: "Description required" },
                        minLength: { value: 5, message: "Mininimum 5 words required" }
                    })} />
                    <br />
                    {errors.description && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black' >{errors.description.message}</p>}

                </div>

                <br />

                <div>

                    <label>Question Image</label>
                    <br />
                    {
                        previewImage && <img src={previewImage} alt="" className='size-24' />
                    }
                    <br />
                    <input type="file" accept="image/*" {...register('questionImage', {
                        required: false
                    })} />
                    <br />
                    {errors.questionImage && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.questionImage.message}</p>}

                </div>

                <br />

                <div>

                    <label>Question Marks</label>
                    <br />
                    <input type="number" placeholder='2' {...register('value', {
                        required: { value: true, message: "Marks for question is required" }
                    })} />
                    <br />
                    {errors.value && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.value.message}</p>}

                </div>

                <br />

                <div className='flex flex-row gap-5'>

                    <div>

                        <label>Option 1</label>

                        <br />

                        <input type="text" {...register('option1', {
                            required: { value: true, message: "Option 1 required" }
                        })} />

                        <br />

                        {errors.option1 && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.option1.message}</p>}

                    </div>

                    <div>

                        <label>Option 2</label>
                        <br />
                        <input type="text" {...register('option2', {
                            required: { value: true, message: "Option 2 required" }
                        })} />
                        <br />
                        {errors.option2 && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.option2.message}</p>}

                    </div>

                    <div>

                        <label>Option 3</label>
                        <br />
                        <input type="text" {...register('option3', {
                            required: { value: true, message: "Option 3 required" }
                        })} />
                        <br />
                        {errors.option3 && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.option3.message}</p>}

                    </div>

                    <div>

                        <label>Option 4</label>
                        <br />
                        <input type="text" {...register('option4', {
                            required: { value: true, message: "Option 4 required" }
                        })} />
                        <br />
                        {errors.option4 && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.option4.message}</p>}

                    </div>

                </div>

                <br />

                <div>
                    <label>Correct Option</label>
                    <br />
                    <select {...register('correctOption', {

                        required: { value: true, message: "Correct option required" }
                    })}
                        // defaultValue="1"
                    >
                        <option value="" disabled>Select correct Option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                        <option value="4">Option 4</option>
                    </select>
                    <br />
                    {errors.correctOption && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.correctOption.message}</p>}

                </div>

                <br />

                <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

            </form>
        </div>
    )
}

export default UpdateQuestion
