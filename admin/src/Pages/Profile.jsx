import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutAdmin } from '../Slices/adminSlice';
import Navbar from '../Components/Navbar';
import { LogOut, Shield, Mail, User as UserIcon, AlertTriangle, Settings, Edit3 } from 'lucide-react';

const LogoutDialogue = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutAdmin())
      .unwrap()
      .then(() => {
        setIsOpen(false);
        navigate('/');
      })
      .catch((e) => {
        setIsOpen(false);
        console.error(e);
      })
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      {/* Added max-w-[90%] for very small devices */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 md:p-8 text-center">
          <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Confirm Logout</h3>
          <p className="text-slate-500 font-medium mt-2">Are you sure you want to end your administrative session?</p>
        </div>

        <div className="flex border-t border-slate-100">
          <button 
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 md:px-6 py-4 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={logout}
            className="flex-1 px-4 md:px-6 py-4 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const adminData = useSelector(state => state.admin.adminData);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20"> {/* pb-20 added for mobile nav clearance */}
      <Navbar />
      
      {/* px-4 for mobile, py-8 for mobile */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10">
          <div className="relative group cursor-pointer" onClick={() => navigate('/update')}>
            <div className="absolute inset-0 bg-purple-500 rounded-[2.5rem] rotate-6 group-hover:rotate-3 transition-transform duration-300" />
            <img 
              src={adminData.profileImage} 
              alt="Admin Profile" 
              className="relative size-36 md:size-48 object-cover rounded-[2.5rem] border-4 border-white shadow-xl"
            />
            {/* Quick Edit Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Edit3 className="text-white" size={32} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg">
              <Shield className="text-purple-600 size-5 md:size-6" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
              <Shield size={12} /> Root Administrator
            </div>
            {/* Responsive text sizes */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-1">{adminData.fullName}</h1>
            <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-2 text-base md:text-lg">
              @{adminData.username}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
              <UserIcon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Identity</p>
              <p className="font-bold text-slate-700 truncate">{adminData.fullName}</p>
            </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
              <Mail size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
              <p className="font-bold text-slate-700 truncate">{adminData.email || 'admin@asanvigyan.com'}</p>
            </div>
          </div>
        </div>

        {/* Account Management Section */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center md:text-left">Account Controls</h3>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            {/* Update Profile Button - w-full on small screens */}
            <button 
              onClick={() => navigate('/update')} 
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              <Settings size={20} className="text-blue-400" />
              Update Credentials
            </button>

            {/* Logout Button - w-full on small screens */}
            <button 
              onClick={() => setIsOpen(true)} 
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-red-100 text-red-500 rounded-2xl font-black hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
            >
              <LogOut size={20} />
              Sign Out of Portal
            </button>
          </div>
        </div>
      </div>

      <LogoutDialogue isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}

export default Profile;