import React from 'react'
import {useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import { fetchAdmin, loginAdmin } from '../Slices/adminSlice';
import {useNavigate} from 'react-router-dom'

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    formState : {errors,isSubmitting},
    handleSubmit,
    watch,
    reset
  } = useForm();

  const onSubmit = (data) =>{

    const postData = {
        "username" : data.username,
        "password" : data.password
    };

    // console.log(postData);
    // console.log(JSON.stringify(postData));

    dispatch(loginAdmin(postData))
    .unwrap()
    .then(() => {
        reset();
        navigate('/');
    })
    .catch((e) => console.error(e))

  }     

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label>Username</label>
            <br />
            <input type="text" placeholder='Enter your Username' {...register('username',{
                required : {value : true , message : 'Username is required'},
                pattern : {value : /^[A-Za-z0-9_.]{2,15}$/, message : "Username is invalid"}
            })} />

            {errors.username && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.username.message}</p > }
        </div>

        <br />

        <div>
            <label>Password</label>
            <br />
            <input type="password" placeholder='********' {...register('password',{
                required : {value : true , message : "Password is required"},
                pattern : {value : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, message : "Invalid password"}
            })} />

            {errors.password && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.password.message}</p> }
        </div>

        <br />

        <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

    </form>
  )
}

export default Login
