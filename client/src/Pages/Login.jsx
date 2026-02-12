import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { loginUser } from '../Slices/userSlice';
import { useNavigate, Link } from 'react-router-dom'
import { Lock, User, Loader2, EyeOff, Eye, AlertCircle } from 'lucide-react'; // Icons for professional touch

const Login = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        const formData = {
            "username": data.username,
            "password": data.password
        }
        
        dispatch(loginUser(formData))
            .unwrap()
            .then(() => {
                reset();
                navigate('/');
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-purple-100/50 p-8 border border-slate-100">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 mt-2 text-sm">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Username Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder='Enter Username' 
                                {...register('username', {
                                    required: "Username is required",
                                    pattern: { value: /^[A-Za-z0-9_.]{2,15}$/, message: "Invalid username format" }
                                })} 
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all duration-200
                                    ${errors.username 
                                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                                        : 'border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50'}`}
                            />
                        </div>
                        {errors.username && <p className="text-xs text-red-500 font-medium ml-1">{errors.username.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'} // Dynamic Type
                                placeholder='••••••••'
                                {...register('password', {
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                        message: "Must be 8+ chars with Symbol & Uppercase"
                                    }
                                })}
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                            />
                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500"><AlertCircle size={14}/>{errors.password.message}</p>}
                    </div>

                    {/* Forgot Password Link (Visual Placeholder) */}
                    {/* <div className="flex justify-end">
                        <button type="button" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                            Forgot password?
                        </button>
                    </div> */}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Signing in...</span>
                            </>
                        ) : "Sign In"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <p className="text-sm text-slate-500">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-purple-600 font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login