import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { loginUser } from '../Slices/userSlice';
import {useNavigate} from 'react-router-dom'

const Login = () => {

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => {

        
        const formData = {
            "username" : data.username,
            "password" : data.password
        }
        
        console.log(formData);
        
        dispatch(loginUser(formData))
        .unwrap()
        .then(() => {reset() ; navigate('/')})
        .catch((err) => {reset() ; console.error(err)})
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div>

                <label>Username</label>

                <br />

                <input type="text" placeholder='Enter Username' {...register('username', {
                    pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "Username is invalid" }
                })} />

                {errors.username && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.username.message}</p>}

            </div>

            <br />

            <div>

                <label>Password</label>

                <br />

                <input type='password' placeholder='Enter your Password'  {...register('password',
                    {
                        pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/ , message: "Invalid password" }
                    }
                )} />

                {errors.password && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.password.message}</p>}

            </div>

            <br />

            <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

        </form>
    )
}

export default Login
