import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOtherUser } from '../Slices/otheruserSlice';
import { ArrowLeft, Zap, Target, Award, Calendar, User as UserIcon, Trophy } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { avatarFunction } from '../Helper/avatarSelector';

const VisitUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(state => state.otheruser.userData);
  const auth = useSelector(state => state.user.isAuthenticated);

  useEffect(() => {
    dispatch(fetchOtherUser({ userId }))
    .unwrap()
    .then(() => {})
    .catch((e) => {
      if(auth){
        setTimeout(()=>{
          window.location.reload();
        },1000)
      }
    })
  }, [dispatch, userId]);

  const formatDOB = (dob) => {
    if (!dob) return 'N/A';
    return new Date(dob).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: "numeric"
    });
  };

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-slate-400 font-bold">Loading Profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Leaderboard
        </button>

        {/* Profile Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          {/* Decorative Banner Background */}
          <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12 mb-8 text-center md:text-left">
              <div className="relative mx-auto md:mx-0">
                <img 
                  src={avatarFunction(userData.avatar)} 
                  alt={userData.username} 
                  className="size-32 md:size-40 rounded-3xl object-cover ring-8 ring-white shadow-xl bg-white" 
                />
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                  {userData.fullName}
                </h1>
                <p className="text-purple-600 font-bold text-lg mt-1">@{userData.username}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                    <Calendar size={14} /> Joined {formatDOB(userData.dob)}
                  </span>
                </div>
              </div>
            </div>

            {/* Public Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-8">
              <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-4 group hover:bg-amber-50 transition-colors">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{userData.highScore}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Best</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-4 group hover:bg-purple-50 transition-colors">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{userData.totalAttempts}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tests Taken</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-4 group hover:bg-blue-50 transition-colors">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{userData.totalScore}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lifetime Pts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Bio/Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <UserIcon size={16} /> Player Identity
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Registered Name</p>
                <p className="text-slate-700 font-semibold">{userData.fullName}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-600 p-8 rounded-3xl shadow-lg shadow-purple-100 flex flex-col justify-center items-center text-center text-white">
             <Trophy size={40} className="mb-2 opacity-80" />
             <h4 className="text-xl font-bold">Challenge {userData.username}</h4>
             <p className="text-purple-100 text-sm mt-1">Think you can beat their high score?</p>
             <button 
               onClick={() => navigate('/game')} 
               className="mt-4 px-6 py-2 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-md"
             >
               Start a Test
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitUser;