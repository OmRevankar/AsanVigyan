import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { registerUser } from '../Slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Camera, Loader2, ArrowLeft, EyeOff, Eye, Check } from 'lucide-react';

import astronaut from '../Assets/astronaut.png'
import bear from '../Assets/bear.png'
import chicken from '../Assets/chicken.png'
import giraffe from '../Assets/giraffe.png'
import knight from '../Assets/knight.png'
import meerkat from '../Assets/meerkat.png'
import ninja from '../Assets/ninja.png'
import panda from '../Assets/panda.png'
import rabbit from '../Assets/rabbit.png'
import robot from '../Assets/robot.png'

const Register = () => {
    const avatars = {
        astronaut, bear, chicken, giraffe, knight, 
        meerkat, ninja, panda, rabbit, robot
    };

    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            avatar: 'panda'
        }
    });

    const selectedAvatar = watch('avatar');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('dob', data.dob.toISOString().split('T')[0]);
        formData.append('avatar', data.avatar);

        dispatch(registerUser(formData))
            .unwrap()
            .then(() => {
                reset();
                navigate('/');
            })
            .catch((error) => console.error(error));
    };

    return (
        /* Added responsive vertical padding (py-6 md:py-12) to prevent the card from touching screen edges */
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-6 md:py-12 px-4">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-purple-100/40 border border-slate-100 overflow-hidden">

                {/* Header Section */}
                {/* Adjusted padding (p-6 md:p-8) for better mobile height */}
                <div className="bg-purple-600 p-6 md:p-8 text-white text-center relative">
                    <button onClick={() => navigate(-1)} className="absolute left-4 md:left-6 top-7 md:top-8 hover:text-purple-200 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-2xl md:text-3xl font-bold">Create Account</h2>
                    <p className="text-purple-100 mt-2 text-sm">Join the community and start competing</p>
                </div>

                {/* Adjusted padding (p-5 md:p-8) to maximize input space on phones */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-8 space-y-6">

                    {/* Avatar Selection Grid */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 block text-center">Choose Your Avatar</label>
                        {/* Improved gap and size scaling for the avatar buttons */}
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                            {Object.entries(avatars).map(([name, img]) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setValue('avatar', name)}
                                    className={`relative size-12 md:size-14 rounded-xl md:rounded-2xl overflow-hidden border-4 transition-all ${
                                        selectedAvatar === name 
                                        ? 'border-purple-600 scale-110 shadow-lg shadow-purple-100' 
                                        : 'border-transparent hover:border-slate-200 grayscale-[0.5] hover:grayscale-0'
                                    }`}
                                >
                                    <img src={img} alt={name} className="w-full h-full object-cover" />
                                    {selectedAvatar === name && (
                                        <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                                            <div className="bg-purple-600 rounded-full p-0.5 text-white">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" {...register('avatar')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type='text' placeholder='John Doe' {...register('fullName', { pattern: { value: /^[A-Za-z0-9 ]+$/, message: "Invalid Name" } })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all" />
                            </div>
                            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                        </div>

                        {/* Username */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type='text' placeholder='johndoe123' {...register('username', { pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "Invalid username" } })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all" />
                            </div>
                            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
                            <Controller
                                control={control}
                                name="dob"
                                rules={{ required: 'Date of Birth is required' }}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="YYYY-MM-DD"
                                        selected={field.value}
                                        onChange={date => field.onChange(date)}
                                        onChangeRaw={(e) => {
                                            const value = e.target.value;
                                            field.onChange(new Date(value));
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        maxDate={new Date()}
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        yearDropdownItemNumber={100}
                                        scrollableYearDropdown
                                        /* Added whitespace-nowrap and box-border to ensure the picker doesn't distort on narrow widths */
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 outline-none transition-all"
                                        /* Ensures the popover container stays within viewport */
                                        popperClassName="datepicker-popper-custom"
                                    />
                                )}
                            />
                        </div>
                        {errors.dob && <p className="text-xs text-red-500">{errors.dob.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='••••••••'
                                {...register('password', {
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                        message: "Must be 8+ chars with Symbol & Uppercase"
                                    }
                                })}
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 md:py-4 rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={22} /> : "Create Free Account"}
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account? {' '}
                        <Link to="/login" className="text-purple-600 font-bold hover:underline">Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;