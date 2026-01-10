import React from 'react'
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../Slices/userSlice';
import { useNavigate } from 'react-router-dom';



const Update = () => {

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState : {errors, isSubmitting}
  } = useForm();

  const userData = useSelector(state => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

//   console.log(userData);

  useEffect(()=>{

    if(userData){
        reset({
            fullName : userData.fullName || "",
            username : userData.username || "",
        })
    }

  }
  ,[userData,reset])


  const watchImage = watch("profileImage");

  const previewImage = (watchImage && watchImage.length > 0) ? URL.createObjectURL(watchImage[0]) : userData?.profileImage;

  const onSubmit = async (data) => {
    
    const formData = new FormData();

    formData.append("fullName",data.fullName);
    formData.append("username",data.username);
    formData.append("profileImage",data.profileImage);
    formData.append("password",data.password);

    dispatch(updateUser(formData))
    .unwrap()
    .then(() => {
        navigate('/');
    })
    .catch((err) => {
        console.error(err);
    })
  }

  return (
    <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div>

                    <label>Profile Image</label>

                    <br />

                    {previewImage && 
                    
                        <img src={previewImage} alt="" className='size-24 rounded-full' />    

                    }

                    <input type="file" accept='image/*' {...register('profileImage',
                        {
                            // required: { value: true, message: "Profile Image is required" }
                        }
                    )} />

                    {errors.profileImage && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.profileImage.message}</p>}

                </div>

                <br />

                <div>

                    <label>Full Name</label>

                    <br />

                    <input type='text' placeholder='OM Revankar'  {...register('fullName',
                        {
                            pattern: { value: /^[A-Za-z0-9]+(?:[ ][A-Za-z0-9]+){0,20}$/, message: "Invalid FullName" }
                        }
                    )} />

                    {errors.fullName && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.fullName.message}</p>}

                </div>

                <br />

                <div>

                    <label>Username</label>

                    <br />

                    <input type='text' placeholder='om_revankar'  {...register('username',
                        {
                            pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "Invalid username" }
                        }
                    )} />

                    {errors.username && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.username.message}</p>}

                </div>

                <br />

                <div>

                    <label>New Password</label>

                    <br />

                    <input type='password' placeholder='Enter New Password'  {...register('password',
                        {
                            required : false,
                            pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, message: "Invalid password" }
                        }
                    )} />

                    {errors.password && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.password.message}</p>}

                </div>

                <br />

                <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

            </form>
        </div>
  )
}

export default Update
