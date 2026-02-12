import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../Slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Lock, Loader2, ArrowLeft, Save, Eye, EyeOff, Check } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { motion } from 'framer-motion';

// Import assets (keeping your existing imports...)
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
    const auth = useSelector(state => state.user.isAuthenticated);
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
                avatar: userData.avatar || "panda",
            });
        }
    }, [userData, reset]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("username", data.username);
        formData.append("avatar", data.avatar);

        if (data.password) formData.append("password", data.password);

        dispatch(updateUser(formData))
            .unwrap()
            .then(() => {
                navigate('/profile');
            })
            .catch(() => {
                if (auth) setTimeout(() => window.location.reload(), 1000);
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-600 hover:text-purple-600 transition-all active:scale-95"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Edit Profile</h1>
                        <p className="text-sm text-slate-500 font-medium">Customize your identity and security</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Avatar Selection Card */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
                        <h2 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em] mb-6">Identity</h2>

                        {/* Preview with Animation */}
                        <div className="relative mb-8">
                            <div className="absolute -inset-4 bg-purple-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                            <motion.div 
                                key={selectedAvatar}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative size-32 md:size-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50"
                            >
                                <img
                                    src={avatars[selectedAvatar] || avatars['panda']}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </div>

                        {/* Avatar Grid - Responsive Spacing */}
                        <div className="grid grid-cols-5 sm:grid-cols-5 md:flex md:flex-wrap justify-center gap-3 md:gap-4">
                            {Object.entries(avatars).map(([name, img]) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setValue('avatar', name)}
                                    className={`relative size-12 md:size-14 rounded-2xl overflow-hidden border-2 transition-all active:scale-90 ${
                                        selectedAvatar === name
                                            ? 'border-purple-600 ring-4 ring-purple-50'
                                            : 'border-slate-100 hover:border-slate-300 grayscale-[0.3] hover:grayscale-0'
                                    }`}
                                >
                                    <img src={img} alt={name} className="w-full h-full object-cover" />
                                    {selectedAvatar === name && (
                                        <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                                            <div className="bg-purple-600 rounded-full p-1 text-white shadow-lg">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" {...register('avatar')} />
                    </div>

                    {/* Form Fields Card */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <h2 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em] mb-2">Account Details</h2>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Display Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                <input
                                    type='text'
                                    placeholder="Enter full name"
                                    {...register('fullName', {
                                        required: "Full name is required",
                                        pattern: { value: /^[A-Za-z0-9 ]+$/, message: "Only letters and numbers allowed" }
                                    })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium"
                                />
                            </div>
                            {errors.fullName && <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.fullName.message}</p>}
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                            <div className="relative group">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                <input
                                    type='text'
                                    placeholder="Choose a unique username"
                                    {...register('username', {
                                        required: "Username is required",
                                        pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "2-15 characters (letters, numbers, _, .)" }
                                    })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium"
                                />
                            </div>
                            {errors.username && <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.username.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Security <span className="text-slate-400 font-normal">(Optional)</span></label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='••••••••'
                                    {...register('password', {
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                            message: "Must include Uppercase, Lowercase, Number & Symbol"
                                        }
                                    })}
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 ml-1">Leave blank to keep your current password.</p>
                            {errors.password && <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    {/* Actions - Sticky/Mobile friendly */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="w-full sm:flex-1 px-6 py-4 border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-white transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:flex-[2] px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-xl shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <><Save size={22} /> Save Changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Update;