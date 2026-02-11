import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../Slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Lock, Loader2, ArrowLeft, Save, Eye, EyeOff, Check } from 'lucide-react';
import Navbar from '../Components/Navbar';

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

const Update = () => {
    const avatars = {
        astronaut, bear, chicken, giraffe, knight, 
        meerkat, ninja, panda, rabbit, robot
    };

    const userData = useSelector(state => state.user.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm();

    const selectedAvatar = watch('avatar');

    useEffect(() => {
        if (userData) {
            reset({
                fullName: userData.fullName || "",
                username: userData.username || "",
                avatar: userData.avatar || "panda", // Initialize with current avatar
            });
        }
    }, [userData, reset]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("username", data.username);
        formData.append("avatar", data.avatar); // Sending avatar name string
        
        if (data.password) formData.append("password", data.password);

        dispatch(updateUser(formData))
            .unwrap()
            .then(() => {
                navigate('/profile');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Back Button & Title */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-purple-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
                        <p className="text-sm text-slate-500">Update your personal information and security</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar Selection Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-6">Choose Your Avatar</h2>
                        
                        {/* Current Selection Preview */}
                        <div className="size-32 rounded-full overflow-hidden border-4 border-purple-50 shadow-inner bg-slate-100 mb-8">
                            <img
                                src={avatars[selectedAvatar] || avatars['panda']}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Avatar Grid */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {Object.entries(avatars).map(([name, img]) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setValue('avatar', name)}
                                    className={`relative size-12 rounded-xl overflow-hidden border-2 transition-all ${
                                        selectedAvatar === name 
                                        ? 'border-purple-600 scale-110 shadow-md shadow-purple-100' 
                                        : 'border-transparent hover:border-slate-200 grayscale-[0.5] hover:grayscale-0'
                                    }`}
                                >
                                    <img src={img} alt={name} className="w-full h-full object-cover" />
                                    {selectedAvatar === name && (
                                        <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center">
                                            <div className="bg-purple-600 rounded-full p-0.5 text-white">
                                                <Check size={8} strokeWidth={4} />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" {...register('avatar')} />
                    </div>

                    {/* Information Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Public Info</h2>

                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type='text'
                                    {...register('fullName', {
                                        pattern: { value: /^[A-Za-z0-9 ]+$/, message: "Invalid Full Name" }
                                    })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                                />
                            </div>
                            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                        </div>

                        {/* Username */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type='text'
                                    {...register('username', {
                                        pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "Invalid username" }
                                    })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                                />
                            </div>
                            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Security</h2>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Leave blank to keep current'
                                    {...register('password', {
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                            message: "Password too weak"
                                        }
                                    })}
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-slate-400"
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
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Update;