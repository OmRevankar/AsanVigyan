import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUser } from '../Slices/userSlice';
import Navbar from '../Components/Navbar';
import { fetchUserTestHistory, sortByLatest, sortByMarksAscend, sortByMarksDesc, sortByOldest } from '../Slices/testSlice';
import { Check, OctagonMinus, X, Calendar, Trophy, Hash, Clock, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { avatarFunction } from '../Helper/avatarSelector';

const User = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userData);
  const testHistory = useSelector(state => state.test.userTestHistory);
  const auth = useSelector((state) => state.admin.isAuthenticated);

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

    dispatch(fetchUser(data))
      .unwrap()
      .then(() => { })
      .catch((e) => {
        console.log("HIIIIIIIIII 1")
        if (auth) {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      });

    dispatch(fetchUserTestHistory(data))
    .unwrap()
      .then(() => { })
      .catch((e) => {
      })

  }, []);

  const toggleTest = (id) => {
    setExpandedTestId(expandedTestId === id ? null : id);
  };

  const handleSort = (type) => {
    switch (type) {
      case 'latest': dispatch(sortByLatest({ cat: 'user' })); break;
      case 'oldest': dispatch(sortByOldest({ cat: 'user' })); break;
      case 'desc': dispatch(sortByMarksDesc({ cat: 'user' })); break;
      case 'asc': dispatch(sortByMarksAscend({ cat: 'user' })); break;
      default: break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* USER PROFILE CARD */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8 md:mb-10">
          <div className="bg-slate-900 p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="relative shrink-0 rounded-full">
              <img src={avatarFunction(user.avatar)} alt="" className="size-24 md:size-32 rounded-full md:rounded-full object-cover border-4 border-slate-700 shadow-2xl" />
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-purple-500 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg">
                <Trophy size={16} className="md:w-5 md:h-5" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1 w-full">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{user.fullName}</h1>
              <p className="text-slate-400 font-bold mb-4 text-sm md:text-base text-nowrap overflow-hidden text-ellipsis">
                @{user.username} • <span className="text-purple-400">UID: {userId}</span>
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                <div className="bg-slate-800/50 p-3 rounded-xl md:rounded-2xl border border-slate-700">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Highest</p>
                  <p className="text-lg md:text-xl font-black text-amber-400">{user.highScore}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl md:rounded-2xl border border-slate-700">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Score</p>
                  <p className="text-lg md:text-xl font-black text-indigo-400">{user.totalScore}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl md:rounded-2xl border border-slate-700">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Attempts</p>
                  <p className="text-lg md:text-xl font-black text-purple-400">{user.totalAttempts}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl md:rounded-2xl border border-slate-700">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Born</p>
                  <p className="text-xs md:text-sm font-bold text-slate-300 leading-tight">{formatDOB(user.dob)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEST HISTORY SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-6 md:h-8 w-1.5 md:w-2 bg-purple-600 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">Audit Test History</h2>
          </div>
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-2.5 shadow-sm w-full sm:w-auto">
            <Filter size={14} className="text-purple-600 mr-2 shrink-0" />
            <select
              onChange={(e) => handleSort(e.target.value)}
              className="bg-transparent text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer w-full"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="desc">Marks: High to Low</option>
              <option value="asc">Marks: Low to High</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {testHistory.length > 0 ? (
            testHistory.map((test, i) => {
              const isExpanded = expandedTestId === test._id;
              return (
                <div key={test._id} className={`bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border transition-all duration-300 ${isExpanded ? 'ring-2 ring-purple-500 shadow-xl' : 'border-slate-100'}`}>
                  
                  {/* Test Header */}
                  <div
                    onClick={() => toggleTest(test._id)}
                    className="px-4 md:px-8 py-4 md:py-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-[1.5rem] md:rounded-[2rem]"
                  >
                    <div className="flex items-center gap-3 md:gap-6">
                      <span className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg md:text-xl shadow-lg shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                          <Hash size={10} /> {test._id}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 font-bold mt-1">
                          <span className="flex items-center gap-1.5 text-xs md:text-sm"><Calendar size={12} className="md:w-[14px]" /> {formatDOB(test.createdAt)}</span>
                          <span className="flex items-center gap-1.5 text-xs md:text-sm"><Clock size={12} className="md:w-[14px]" /> {formatTime(test.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-6 ml-auto sm:ml-0">
                      <div className="bg-white px-4 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl border-2 border-purple-100 flex flex-col items-center min-w-[80px] md:min-w-[100px]">
                        <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                        <span className="text-xl md:text-2xl font-black text-purple-600">{test.score}</span>
                      </div>
                      <div className={`p-1.5 md:p-2 rounded-full transition-colors ${isExpanded ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 md:p-8 pt-0 space-y-4 md:space-y-6 border-t border-slate-50">
                          <div className="mt-4 md:mt-6 space-y-4">
                            {test.responses.map((qn, j) => {
                              const isUnattempted = qn.status === 'unattempted';
                              const isCorrect = qn.status === 'correct';

                              return (
                                <div key={qn.uid} className={`rounded-xl md:rounded-2xl border transition-all ${isUnattempted ? 'bg-amber-50/30 border-amber-100' : 'bg-white border-slate-100'}`}>
                                  <div className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex gap-3 md:gap-4 flex-1">
                                      <span className="font-black text-slate-300 text-lg md:text-xl shrink-0">{j + 1}.</span>
                                      <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-sm md:text-base leading-snug break-words">{qn.question.description}</p>
                                        <p className="text-[8px] md:text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-tighter truncate">Q-UID: {qn.uid}</p>
                                      </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                                      <div className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest
                                      ${isCorrect ? 'bg-green-100 text-green-700' : (qn.status === 'incorrect' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}`}>
                                        {isCorrect ? <Check size={10} strokeWidth={3} /> : (qn.status === 'incorrect' ? <X size={10} strokeWidth={3} /> : <OctagonMinus size={10} strokeWidth={3} />)}
                                        {qn.status}
                                      </div>
                                      <span className="text-xs md:text-sm font-black text-slate-400 whitespace-nowrap">{qn.score} / {qn.question.value} Pts</span>
                                    </div>
                                  </div>

                                  <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                    {qn.question.options.map((opt) => {
                                      const isCorrectOpt = opt.id === qn.question.correctOption;
                                      const isSelected = qn.selectedOption === opt.id;
                                      let bgClass = "bg-slate-50 border-slate-100 text-slate-500";
                                      if (isCorrectOpt) bgClass = "bg-green-500 text-white border-green-500 shadow-md shadow-green-100 z-10 scale-[1.01]";
                                      else if (isSelected && !isCorrectOpt) bgClass = "bg-red-500 text-white border-red-500";

                                      return (
                                        <div key={opt.id} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-lg md:rounded-xl border text-xs md:text-sm font-bold transition-all ${bgClass}`}>
                                          <span className={`size-5 md:size-6 rounded md:rounded-lg flex items-center justify-center text-[9px] md:text-[10px] border shrink-0 ${isCorrectOpt || isSelected ? 'border-white/20 bg-black/10' : 'bg-white border-slate-200'}`}>
                                            {opt.id}
                                          </span>
                                          <span className="line-clamp-2">{opt.text}</span>
                                          {isCorrectOpt && isSelected && <Check size={12} className="ml-auto shrink-0" />}
                                          {!isCorrectOpt && isSelected && <X size={12} className="ml-auto shrink-0" />}
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
            })
          ) : (
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                No records found
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default User;