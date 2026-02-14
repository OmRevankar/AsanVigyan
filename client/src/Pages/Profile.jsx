import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTestHistory } from '../Slices/testSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../Slices/userSlice';
import { X, OctagonMinus, Check, LogOut, Edit3, Award, Zap, Target, Calendar, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { avatarFunction } from '../Helper/avatarSelector';

const LogoutDialogue = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!isOpen) return null;
  const logout = () => {
    dispatch(logoutUser()).unwrap().then(() => {
      setIsOpen(false);
      navigate('/');
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      <div className="relative bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
            <LogOut className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sign Out</h3>
          <p className="text-slate-500 mt-2 text-sm">Are you sure you want to log out of your account?</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={() => setIsOpen(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-2xl hover:bg-slate-50 transition-colors order-2 sm:order-1">Cancel</button>
          <button onClick={logout} className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors order-1 sm:order-2">Logout</button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState(null);

  const userData = useSelector(state => state.user.userData);
  const testHistory = useSelector(state => state.test.testHistory);
  const auth = useSelector(state => state.user.isAuthenticated);
  const userLoading = useSelector(state => state.user.isLoading);
  const testLoading = useSelector(state => state.test.isLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserTestHistory()).unwrap().catch((e) => {
      if (auth) setTimeout(() => { window.location.reload(); }, 1000);
    });
  }, [dispatch, auth]);

  const formatDOB = (dob) => dob ? new Date(dob).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: "numeric" }) : 'N/A';
  const formatTime = (time) => time ? new Date(time).toLocaleString(undefined, { hour: "numeric", minute: "2-digit" }) : "N/A";

  const toggleTest = (id) => {
    setExpandedTestId(prevId => prevId === id ? null : id);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
          <p className="text-slate-500 font-bold tracking-wide">
            Loading Your Profile . . .
          </p>
        </div>
      </div>
    );
  }

  if (testLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        <Navbar />
        <LogoutDialogue isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 md:mt-10">
          {/* Profile Header Card */}
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100 mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-10">

              {/* Avatar Section */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-full blur opacity-20"></div>
                <img src={avatarFunction(userData.avatar)} alt="avatar" className="relative size-28 md:size-36 rounded-full object-cover border-4 border-white shadow-md" />
                <button onClick={() => navigate('/update')} className="absolute bottom-0 right-0 p-2.5 bg-white shadow-xl rounded-2xl border border-slate-100 text-purple-600 hover:scale-110 transition-transform">
                  <Edit3 size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left space-y-3">
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">{userData.fullName}</h1>
                  <p className="text-slate-400 font-bold text-sm md:text-base">@{userData.username}</p>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                  <span className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs md:text-sm font-bold">
                    <Calendar size={14} /> {formatDOB(userData.dob)}
                  </span>
                  <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold hover:bg-red-100 transition-colors">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* Stats Grid - Optimized for Mobile */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                {[
                  { label: 'High Score', val: userData.highScore, icon: <Zap size={18} />, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Tests', val: userData.totalAttempts, icon: <Target size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Points', val: userData.totalScore, icon: <Award size={18} />, color: 'text-blue-500', bg: 'bg-blue-50' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-50/80 p-3 md:p-5 rounded-2xl text-center border border-slate-100">
                    <div className={`mx-auto mb-2 size-8 md:size-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <p className="text-lg md:text-2xl font-black text-slate-800 leading-none">{stat.val}</p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mt-2 tracking-tighter">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
            <p className="text-slate-500 font-bold tracking-wide">
              Loading Your Test Activity . . .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <LogoutDialogue isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 md:mt-10">
        {/* Profile Header Card */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-10">

            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-full blur opacity-20"></div>
              <img src={avatarFunction(userData.avatar)} alt="avatar" className="relative size-28 md:size-36 rounded-full object-cover border-4 border-white shadow-md" />
              <button onClick={() => navigate('/update')} className="absolute bottom-0 right-0 p-2.5 bg-white shadow-xl rounded-2xl border border-slate-100 text-purple-600 hover:scale-110 transition-transform">
                <Edit3 size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left space-y-3">
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">{userData.fullName}</h1>
                <p className="text-slate-400 font-bold text-sm md:text-base">@{userData.username}</p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                <span className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs md:text-sm font-bold">
                  <Calendar size={14} /> {formatDOB(userData.dob)}
                </span>
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold hover:bg-red-100 transition-colors">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>

            {/* Stats Grid - Optimized for Mobile */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto mt-6 lg:mt-0">
              {[
                { label: 'High Score', val: userData.highScore, icon: <Zap size={18} />, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Tests', val: userData.totalAttempts, icon: <Target size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Points', val: userData.totalScore, icon: <Award size={18} />, color: 'text-blue-500', bg: 'bg-blue-50' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-50/80 p-3 md:p-5 rounded-2xl text-center border border-slate-100">
                  <div className={`mx-auto mb-2 size-8 md:size-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <p className="text-lg md:text-2xl font-black text-slate-800 leading-none">{stat.val}</p>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mt-2 tracking-tighter">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test History Section */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Clock className="text-purple-600" /> Recent Activity
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{testHistory.length} Sessions</span>
        </div>

        <div className="space-y-4">
          {testHistory.map((test, i) => {
            const currentId = test.uid || test._id || i;
            const isExpanded = expandedTestId === currentId;

            return (
              <div key={currentId} className={`bg-white rounded-[1.5rem] shadow-sm border transition-all duration-300 ${isExpanded ? 'border-purple-200 ring-4 ring-purple-50' : 'border-slate-100'}`}>

                {/* Clickable Header */}
                <div
                  onClick={() => toggleTest(currentId)}
                  className="p-4 md:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className={`size-10 md:size-12 shrink-0 flex items-center justify-center rounded-2xl font-black text-sm md:text-base transition-all ${isExpanded ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-slate-100 text-slate-500'}`}>
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-800 font-bold text-sm md:text-base truncate">Quiz Session</p>
                      <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wide">{formatDOB(test.createdAt)} • {formatTime(test.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest hidden md:block">Score</p>
                      <p className="text-lg md:text-2xl font-black text-purple-600">{test.score} <span className="text-[10px] md:text-xs font-bold text-slate-300">PTS</span></p>
                    </div>
                    <div className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-purple-100 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Responses List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-50"
                    >
                      <div className="p-4 md:p-6 space-y-4 bg-slate-50/50">
                        {test.responses.map((qn, j) => (
                          <div key={qn.uid} className={`rounded-2xl border bg-white p-4 md:p-5 shadow-sm transition-all ${qn.status === 'correct' ? 'border-green-100' : qn.status === 'incorrect' ? 'border-red-100' : 'border-amber-100'}`}>
                            <div className="flex justify-between items-start gap-4 mb-4">
                              <p className="font-bold text-slate-700 text-sm md:text-base leading-snug">
                                <span className="text-purple-400 mr-2">Q{j + 1}.</span>{qn.question.description}
                              </p>
                              <div className="shrink-0 flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg">
                                <span className="text-[10px] md:text-xs font-black text-slate-500 whitespace-nowrap">{qn.score}/{qn.question.value}</span>
                                {qn.status === "correct" ? <Check className="text-green-600" size={16} /> : (qn.status === "incorrect" ? <X className="text-red-600" size={16} /> : <OctagonMinus className="text-amber-600" size={16} />)}
                              </div>
                            </div>

                            {/* Options Grid - Responsive columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {qn.question.options.map((opt) => {
                                const isCorrect = opt.id === qn.question.correctOption;
                                const isSelected = opt.id === qn.selectedOption;

                                return (
                                  <div key={opt.id} className={`text-xs md:text-sm p-3 rounded-xl border flex justify-between items-center transition-all
                                    ${isCorrect ? 'bg-green-50 border-green-200 text-green-800 font-bold' :
                                      isSelected && !isCorrect ? 'bg-red-50 border-red-200 text-red-800 font-bold' :
                                        'bg-slate-50/50 border-slate-100 text-slate-500'}`}>
                                    <span className="pr-2">{opt.text}</span>
                                    {isCorrect && <Check size={14} className="shrink-0" />}
                                    {isSelected && !isCorrect && <X size={14} className="shrink-0" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;