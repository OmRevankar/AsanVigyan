import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateAdmin } from '../Slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Lock, Camera, Save, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Navbar from '../Components/Navbar';

const Update = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    reset
  } = useForm();

  const adminData = useSelector(state => state.admin.adminData);
  const auth = useSelector(state => state.admin.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const watchImage = watch('profileImage');
  const previewImage = (watchImage && watchImage.length > 0)
    ? URL.createObjectURL(watchImage[0])
    : adminData?.profileImage;

  useEffect(() => {
    if (adminData) {
      reset({
        fullName: adminData.fullName || "",
        username: adminData.username || ""
      })
    }
  }, [adminData, reset]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    if (data.password) formData.append('password', data.password);
    if (data.profileImage?.[0]) formData.append('profileImage', data.profileImage[0]);

    dispatch(updateAdmin(formData))
      .unwrap()
      .then(() => {
        reset();
        navigate('/profile');
      })
      .catch((e) => {
        if (auth) {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      })
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm mb-6 md:mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-6 md:p-8 text-center relative">
            <h1 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">Edit Credentials</h1>
            <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1">Update your administrative identity</p>
          </div>

          {/* Adjusted padding for mobile (p-6) vs desktop (p-12) */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-12 space-y-6 md:space-y-8">

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="size-28 md:size-32 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={40} />
                    </div>
                  )}
                </div>
                {/* Always visible edit trigger on mobile via a smaller icon or overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                  <input type="file" accept='image/*' className="hidden" {...register('profileImage')} />
                </label>
              </div>
              <p className="mt-3 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Click photo to change</p>
            </div>

            <div className="space-y-5 md:space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} md:size={20} />
                  <input
                    type="text"
                    className={`w-full pl-12 md:pl-14 pr-6 py-3.5 md:py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-sm md:text-base text-slate-700 ${errors.fullName ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-purple-400 focus:bg-white'}`}
                    placeholder="John Doe"
                    {...register('fullName', {
                      required: "Full name is required",
                      pattern: { value: /^[A-Za-z0-9 ]+$/, message: "No special characters allowed" }
                    })}
                  />
                </div>
                {errors.fullName && <p className="mt-2 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle size={14} /> {errors.fullName.message}</p>}
              </div>

              {/* Username */}
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} md:size={20} />
                  <input
                    type="text"
                    className={`w-full pl-12 md:pl-14 pr-6 py-3.5 md:py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-sm md:text-base text-slate-700 ${errors.username ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-purple-400 focus:bg-white'}`}
                    placeholder="admin_user"
                    {...register('username', {
                      required: "Username is required",
                      pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "2-15 chars, letters/numbers/dots only" }
                    })}
                  />
                </div>
                {errors.username && <p className="mt-2 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle size={14} /> {errors.username.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 leading-relaxed">New Password (Leave blank to keep current)</label>
                <div className="relative">
                  <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} md:size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-12 md:pl-14 pr-12 md:pr-14 py-3.5 md:py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-sm md:text-base text-slate-700 ${errors.password ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-purple-400 focus:bg-white'}`}
                    placeholder="••••••••"
                    {...register('password', {
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                        message: "Must include uppercase, lowercase, number, and symbol"
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} md:size={20} /> : <Eye size={18} md:size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle size={14} /> {errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white py-4 md:py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 disabled:opacity-50 active:scale-[0.98]"
            >
              {isSubmitting ? "Processing..." : <><Save size={18} md:size={20} /> Update Account</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Update;