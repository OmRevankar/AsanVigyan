import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateAdmin } from '../Slices/adminSlice';
import {useNavigate} from 'react-router-dom';

const Update = () => {

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    reset
  } = useForm();

  const adminData = useSelector(state => state.admin.adminData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const watchImage = watch('profileImage');
  const previewImage = (watchImage && watchImage.length > 0) ? URL.createObjectURL(watchImage[0]) : adminData?.profileImage;

  useEffect(() => {

    if (adminData) {
      reset({
        fullName: adminData.fullName || "",
        username: adminData.username || ""
      })
    }

  }, [adminData,reset]);

  const onSubmit = (data) => {

    const formData = new FormData();

    formData.append('fullName',data.fullName);
    formData.append('username',data.username);
    formData.append('password',data.password);
    formData.append('profileImage',data.profileImage[0]);

    dispatch(updateAdmin(formData))
    .unwrap()
    .then(() => {
      reset();
      navigate('/');
    })
    .catch((e) => {
      console.error(e);
    })

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Profile Image</label>
        <br />
        {
          previewImage && <img src={previewImage} alt="" className='size-24' />
        }
        <br />
        <input type="file" accept='image/*' {...register('profileImage', {
          // required: { value: true, message: "Profile Image required" }
        })} />
        <br />
        {errors.profileImage && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.profileImage.message}</p>}
      </div>

      <br />

      <div>
        <label>Full Name</label>

        <br />

        <input type="text" placeholder='Enter New Full Name' {...register('fullName', {
          required: { value: true, message: "Full Name required" },
          pattern: { value: /^[A-Za-z0-9]+(?:[ ][A-Za-z0-9]+){0,20}$/, message: "Invalid Full Name" }
        })} />

        <br />

        {errors.fullName && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.fullName.message}</p>}
      </div>

      <br />

      <div>
        <label>Username</label>

        <br />

        <input type="text" placeholder='Enter New Username' {...register('username', {
          required: { value: true, message: "Username is required" },
          pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "Invalid Username" }
        })} />

        <br />

        {errors.username && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.username.message}</p>}
      </div>

        <br />

      <div>
        <label>Password</label>

        <br />

        <input type="password" placeholder='********' {...register('password', {
          // required: { value: true, message: "Full Name required" },
          pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, message: "Invalid Full Name" }
        })} />

        <br />

        {errors.password && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.password.message}</p>}
      </div>

      <br />

      <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

    </form>
  )
}

export default Update
