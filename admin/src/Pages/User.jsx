import React, { useEffect, useState } from 'react'; // Added useState
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUser } from '../Slices/userSlice';
import Navbar from '../Components/Navbar';
import { fetchUserTestHistory } from '../Slices/testSlice';
import { Check, OctagonMinus, X, Calendar, Trophy, Hash, Clock, ChevronDown, ChevronUp } from 'lucide-react'; // Added Chevrons
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion

const User = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userData);
  const testHistory = useSelector(state => state.test.userTestHistory);

  // State to track which test is expanded
  const [expandedTestId, setExpandedTestId] = useState(null);

  const formatDOB = (dob) => {
    const date = new Date(dob);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: "numeric" });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const date = new Date(time);
    return date.toLocaleString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
  };

  useEffect(() => {
    const data = { userId };
    dispatch(fetchUser(data));
    dispatch(fetchUserTestHistory(data));
  }, [dispatch, userId]);

  // Toggle function
  const toggleTest = (id) => {
    setExpandedTestId(expandedTestId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* USER PROFILE CARD (Existing code stays the same) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-10">
           <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img src={user.profileImage} alt="" className="size-32 rounded-3xl object-cover border-4 border-slate-700 shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 bg-purple-500 p-2 rounded-xl shadow-lg">
                <Trophy size={20} />
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black tracking-tight">{user.fullName}</h1>
              <p className="text-slate-400 font-bold mb-4">@{user.username} • <span className="text-purple-400">UID: {userId}</span></p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Highest</p>
                  <p className="text-xl font-black text-amber-400">{user.highScore}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Score</p>
                  <p className="text-xl font-black text-indigo-400">{user.totalScore}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Attempts</p>
                  <p className="text-xl font-black text-purple-400">{user.totalAttempts}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Born</p>
                  <p className="text-sm font-bold text-slate-300 leading-tight">{formatDOB(user.dob)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEST HISTORY SECTION */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-2 bg-purple-600 rounded-full"></div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Audit Test History</h2>
        </div>

        <div className="space-y-6">
          {testHistory.map((test, i) => {
            const isExpanded = expandedTestId === test._id;

            return (
              <div key={test._id} className={`bg-white rounded-[2rem] shadow-sm border transition-all duration-300 ${isExpanded ? 'ring-2 ring-purple-500 shadow-xl' : 'border-slate-100'}`}>
                
                {/* Test Header - Clickable for toggle */}
                <div 
                  onClick={() => toggleTest(test._id)}
                  className="px-8 py-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-[2rem]"
                >
                  <div className="flex items-center gap-6">
                    <span className="size-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Hash size={12} /> {test._id}
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 font-bold mt-1">
                        <span className="flex items-center gap-1.5 text-sm"><Calendar size={14} /> {formatDOB(test.createdAt)}</span>
                        <span className="flex items-center gap-1.5 text-sm"><Clock size={14} /> {formatTime(test.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="bg-white px-6 py-2 rounded-2xl border-2 border-purple-100 flex flex-col items-center min-w-[100px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Score</span>
                      <span className="text-2xl font-black text-purple-600">{test.score}</span>
                    </div>
                    <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                </div>

                {/* Responses List - Animated Expansion */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 space-y-6 border-t border-slate-50">
                        <div className="mt-6 space-y-4">
                          {test.responses.map((qn, j) => {
                            const isUnattempted = qn.status === 'unattempted';
                            const isCorrect = qn.status === 'correct';
                            
                            return (
                              <div key={qn.uid} className={`rounded-2xl border transition-all ${isUnattempted ? 'bg-amber-50/30 border-amber-100' : 'bg-white border-slate-100'}`}>
                                <div className="p-4 flex flex-wrap items-start justify-between gap-4">
                                  <div className="flex gap-4 flex-1">
                                    <span className="font-black text-slate-300 text-xl">{j + 1}.</span>
                                    <div>
                                      <p className="font-bold text-slate-800 leading-snug">{qn.question.description}</p>
                                      <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-tighter">Q-UID: {qn.uid}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                      ${isCorrect ? 'bg-green-100 text-green-700' : (qn.status === 'incorrect' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}`}>
                                      {isCorrect ? <Check size={12} strokeWidth={3} /> : (qn.status === 'incorrect' ? <X size={12} strokeWidth={3} /> : <OctagonMinus size={12} strokeWidth={3} />)}
                                      {qn.status}
                                    </div>
                                    <span className="text-sm font-black text-slate-400">{qn.score} / {qn.question.value} Pts</span>
                                  </div>
                                </div>

                                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {qn.question.options.map((opt) => {
                                    const isCorrectOpt = opt.id === qn.question.correctOption;
                                    const isSelected = qn.selectedOption === opt.id;
                                    
                                    let bgClass = "bg-slate-50 border-slate-100 text-slate-500";
                                    if (isCorrectOpt) bgClass = "bg-green-500 text-white border-green-500 shadow-md shadow-green-100 z-10 scale-[1.02]";
                                    else if (isSelected && !isCorrectOpt) bgClass = "bg-red-500 text-white border-red-500";

                                    return (
                                      <div key={opt.id} className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${bgClass}`}>
                                        <span className={`size-6 rounded-lg flex items-center justify-center text-[10px] border ${isCorrectOpt || isSelected ? 'border-white/20 bg-black/10' : 'bg-white border-slate-200'}`}>
                                          {opt.id}
                                        </span>
                                        {opt.text}
                                        {isCorrectOpt && isSelected && <Check size={14} className="ml-auto" />}
                                        {!isCorrectOpt && isSelected && <X size={14} className="ml-auto" />}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default User;