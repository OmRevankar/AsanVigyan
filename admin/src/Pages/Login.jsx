import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../Slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, Loader2 , Eye , EyeOff } from 'lucide-react';
import { useState } from 'react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset
  } = useForm();

  const onSubmit = (data) => {
    const postData = {
      "username": data.username,
      "password": data.password
    };

    dispatch(loginAdmin(postData))
      .unwrap()
      .then(() => {
        reset();
        navigate('/');
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600" />
      
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200 mb-4">
            <ShieldCheck className="text-white size-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Admin Portal</h1>
          <p className="text-slate-500 font-medium mt-1">Management Access Only</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="size-5 text-slate-300 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder='Enter admin username' 
                  className={`w-full pl-11 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                    ${errors.username ? 'border-red-100 focus:border-red-400' : 'border-slate-50 focus:border-purple-500 focus:bg-white focus:shadow-md'}`}
                  {...register('username', {
                    required: { value: true, message: 'Username is required' },
                    pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "Username is invalid" }
                  })} 
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs font-bold mt-2 ml-1 flex items-center gap-1">
                  <span className="size-1 bg-red-500 rounded-full" /> {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-14 pr-14 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-slate-700 ${errors.password ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-purple-400 focus:bg-white'}`}
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
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> {errors.password.message}</p>}
              </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin size-5" />
                  Authenticating...
                </>
              ) : (
                "Authorize Entry"
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Protected Environment. All actions are logged.
        </p>
      </div>
    </div>
  );
};

export default Login;