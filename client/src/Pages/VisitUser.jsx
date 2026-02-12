import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOtherUser } from '../Slices/otheruserSlice';
import { ArrowLeft, Zap, Target, Award, Calendar, User as UserIcon, Trophy } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { avatarFunction } from '../Helper/avatarSelector';
import { motion } from 'framer-motion';

const VisitUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(state => state.otheruser.userData);
  const auth = useSelector(state => state.user.isAuthenticated);

  useEffect(() => {
    dispatch(fetchOtherUser({ userId }))
      .unwrap()
      .catch((e) => {
        if (auth) setTimeout(() => window.location.reload(), 1000);
      });
  }, [dispatch, userId, auth]);

  const formatDOB = (dob) => {
    if (!dob) return 'N/A';
    return new Date(dob).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: "numeric"
    });
  };

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Loading Profile</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 md:mt-10">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-all group active:scale-95"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Leaderboard</span>
        </button>

        {/* Profile Hero Card */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
          {/* Banner */}
          <div className="h-32 md:h-44 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="px-6 md:px-10 pb-10">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8 -mt-16 md:-mt-20 mb-10 text-center md:text-left">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="relative shrink-0"
              >
                <img 
                  src={avatarFunction(userData.avatar)} 
                  alt={userData.username} 
                  className="size-32 md:size-44 rounded-[2rem] object-cover ring-[10px] ring-white shadow-2xl bg-white" 
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 size-6 md:size-8 border-4 border-white rounded-full"></div>
              </motion.div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                  {userData.fullName}
                </h1>
                <p className="text-purple-600 font-black text-lg md:text-xl">@{userData.username}</p>
                <div className="flex justify-center md:justify-start mt-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                    <Calendar size={14} /> Joined {formatDOB(userData.dob)}
                  </span>
                </div>
              </div>
            </div>

            {/* Public Stats Grid - Responsive Rows/Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[
                { label: 'Personal Best', val: userData.highScore, icon: <Zap size={22} fill="currentColor" />, color: 'amber' },
                { label: 'Tests Taken', val: userData.totalAttempts, icon: <Target size={22} />, color: 'purple' },
                { label: 'Lifetime Pts', val: userData.totalScore, icon: <Award size={22} />, color: 'blue' }
              ].map((stat, i) => (
                <div key={i} className={`p-5 rounded-3xl flex items-center gap-4 border border-transparent transition-all bg-slate-50 hover:bg-${stat.color}-50 hover:border-${stat.color}-100 group`}>
                  <div className={`p-3 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-800 leading-none">{stat.val}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Identity Card */}
          <div className="md:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <UserIcon size={16} className="text-purple-500" /> Player Identity
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                   <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                  <p className="text-slate-800 font-black text-lg">{userData.fullName}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Challenge Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-purple-600 p-8 rounded-[2rem] shadow-xl shadow-purple-200 flex flex-col justify-center items-center text-center text-white relative overflow-hidden group"
          >
             {/* Decorative BG element */}
             <Trophy size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
             
             <div className="relative z-10">
               <div className="bg-white/20 p-3 rounded-2xl w-fit mx-auto mb-4 backdrop-blur-md">
                 <Trophy size={32} />
               </div>
               <h4 className="text-xl md:text-2xl font-black">Challenge {userData.username.split(' ')[0]}</h4>
               <p className="text-purple-100 text-sm mt-2 font-medium">Can you beat their high score of {userData.highScore}?</p>
               <button 
                 onClick={() => navigate('/game')} 
                 className="mt-6 w-full py-4 bg-white text-purple-600 font-black rounded-2xl hover:bg-purple-50 active:scale-95 transition-all shadow-lg shadow-purple-900/20"
               >
                 Take the Test
               </button>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisitUser;