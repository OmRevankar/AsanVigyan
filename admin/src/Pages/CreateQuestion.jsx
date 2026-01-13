import React from 'react'
import { useForm } from 'react-hook-form'
import {useDispatch} from 'react-redux'
import { createQuestion } from '../Slices/questionSlice';
import { useNavigate } from 'react-router-dom';

const CreateQuestion = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm();

    const onSubmit = async (data) => {

        const formData = new FormData();

        formData.append('description',data.description);
        formData.append('questionImage',data.questionImage?.[0]);
        formData.append('value',data.value);
        formData.append('correctOption',data.correctOption);

        const options = [{id:1,text:data.option1} , {id:2,text:data.option2} , {id:3,text:data.option3} , {id:4,text:data.option4}]
        formData.append("options",JSON.stringify(options));

        dispatch(createQuestion(formData))
        .unwrap()
        .then(() => {
            reset();
            navigate('/');
        })
        .catch((e) => console.error(e))
    }

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
                    <input type="number" placeholder='2' {...register('value',{
                        required : {value : true , message : "Marks for question is required"}
                    })} />
                    <br />
                    {errors.value && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.value.message}</p> }

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
                    <select {...register('correctOption',{
                        
                        required : {value : true , message : "Correct option required"}
                    })}
                        defaultValue="1"
                    >
                        <option value="" disabled>Select correct Option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                        <option value="4">Option 4</option>
                    </select>
                    <br />
                    {errors.correctOption && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.correctOption.message}</p> }

                </div>

                <br />

                <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

            </form>
        </div>
    )
}

export default CreateQuestion
