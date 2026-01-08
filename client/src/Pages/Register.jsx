import React from 'react'
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch } from 'react-redux';
import { registerUser } from '../Slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const {
        watch,
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => {

        const formData = new FormData();

        formData.append('fullName', data.fullName);
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('dob', data.dob.toISOString().split('T')[0]);
        formData.append('profileImage', data.profileImage[0]);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        dispatch(registerUser(formData))
        .unwrap()
        .then(()=>{
            reset();
            navigate('/');
        })
        .catch((error)=>{
            console.log("HI");
            console.error(error);
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div>

                    <label>Profile Image</label>

                    <br />

                    <input type="file" accept='image/*' {...register('profileImage',
                        {
                            required: { value: true, message: "Profile Image is required" }
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
                    <label>Date of Birth</label>

                    <br />

                    <Controller
                        control={control}
                        name="dob"
                        defaultValue={null}
                        rules={{ required: 'Date of Birth is required' }}
                        render={({ field }) => (
                            <DatePicker
                                placeholderText="Select your birth date"
                                selected={field.value}
                                onChange={date => field.onChange(date)}
                                dateFormat="yyyy-MM-dd"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                                className="border px-2 py-1"
                            />
                        )}
                    />

                    {errors.dob && <p className='border-2 border-red-900 px-3 py-2 bg-red-400 text-black'>{errors.dob.message}</p>}

                </div>

                <br />

                <div>

                    <label>Password</label>

                    <br />

                    <input type='password' placeholder='Enter Password'  {...register('password',
                        {
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

export default Register
