import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../Slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Lock, Camera, Loader2, ArrowLeft, Save } from 'lucide-react';
import Navbar from '../Components/Navbar';

const Update = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    const userData = useSelector(state => state.user.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            reset({
                fullName: userData.fullName || "",
                username: userData.username || "",
            });
        }
    }, [userData, reset]);

    const watchImage = watch("profileImage");
    const previewImage = (watchImage && watchImage.length > 0) 
        ? URL.createObjectURL(watchImage[0]) 
        : userData?.profileImage;

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("username", data.username);
        if (data.profileImage?.[0]) formData.append("profileImage", data.profileImage[0]);
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
                    {/* Profile Picture Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                        <div className="relative group">
                            <div className="size-32 rounded-full overflow-hidden border-4 border-purple-50 shadow-inner bg-slate-100">
                                <img 
                                    src={previewImage || 'https://via.placeholder.com/128'} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover transition-opacity group-hover:opacity-75" 
                                />
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/40 p-3 rounded-full text-white backdrop-blur-sm">
                                    <Camera size={24} />
                                </div>
                                <input 
                                    type="file" 
                                    accept='image/*' 
                                    className="hidden"
                                    {...register('profileImage')} 
                                />
                            </label>
                        </div>
                        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Click photo to change</p>
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
                                    type='password' 
                                    placeholder='Leave blank to keep current'
                                    {...register('password', {
                                        pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, message: "Password too weak" }
                                    })} 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-slate-400"
                                />
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