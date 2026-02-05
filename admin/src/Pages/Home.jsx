import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAll } from '../Slices/testSlice';
import { Check, OctagonMinus, X, ChevronDown, ChevronUp, User, Clock, Calendar, Activity, ListChecks } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const dispatch = useDispatch();
  const testHistory = useSelector(state => state.test.testHistory);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDOB = (dob) => {
    return new Date(dob).toLocaleDateString(undefined, {
      month: 'short', year: 'numeric', day: "numeric"
    });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return new Date(time).toLocaleString(undefined, {
      hour: "numeric", minute: "2-digit", hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Dashboard Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="size-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sessions</p>
              <p className="text-2xl font-black text-slate-800">{testHistory.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="size-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Users</p>
              <p className="text-2xl font-black text-slate-800">Global Admin</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="size-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <ListChecks size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Status</p>
              <p className="text-2xl font-black text-green-600 italic uppercase text-sm">Live Monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
            <Clock className="text-purple-600" /> Recent Activity Feed
          </h2>
        </div>

        {/* Test Activity List */}
        <div className="space-y-4">
          {testHistory.map((test, i) => {
            const isExpanded = expandedId === test.uid;

            return (
              <div key={test.uid} className={`bg-white rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'ring-2 ring-purple-500 shadow-xl' : 'border-slate-100 hover:border-purple-200 shadow-sm'}`}>
                
                {/* Summary Row (Clickable) */}
                <div 
                  onClick={() => toggleExpand(test.uid)}
                  className="px-8 py-6 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-slate-300 font-black text-xl">{(i + 1).toString().padStart(2, '0')}</span>
                    <div>
                      <NavLink 
                        to={`/u/${test.userId}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="text-lg font-black text-slate-800 hover:text-purple-600 transition-colors flex items-center gap-2"
                      >
                        {test.fullName}
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-tighter">View Profile</span>
                      </NavLink>
                      <div className="flex items-center gap-3 text-slate-400 text-xs font-bold mt-1">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDOB(test.createdAt)}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(test.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achieved Score</p>
                      <p className="text-xl font-black text-purple-600">{test.score}</p>
                    </div>
                    <div className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-2 border-t border-slate-50">
                        <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Detailed Responses Audit</p>
                          
                          {test.responses.map((qn, j) => (
                            <div key={qn.uid} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3">
                                  <span className="font-black text-slate-300">{j + 1}.</span>
                                  <p className="font-bold text-slate-700 text-sm leading-relaxed">{qn.question.description}</p>
                                </div>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                  ${qn.status === 'correct' ? 'bg-green-100 text-green-700' : (qn.status === 'incorrect' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}`}>
                                  {qn.status === "correct" ? <Check size={12} /> : (qn.status === "incorrect" ? <X size={12} /> : <OctagonMinus size={12} />)}
                                  {qn.status}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                {qn.question.options.map((opt) => {
                                  const isCorrect = opt.id === qn.question.correctOption;
                                  const isSelected = qn.selectedOption === opt.id;
                                  
                                  let pillStyle = "bg-slate-50 border-slate-100 text-slate-400";
                                  if (isCorrect) pillStyle = "bg-green-500 text-white border-green-500 shadow-sm";
                                  else if (isSelected && !isCorrect) pillStyle = "bg-red-500 text-white border-red-500";

                                  return (
                                    <div key={opt.id} className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${pillStyle}`}>
                                      <span className="opacity-60">{opt.id}.</span> {opt.text}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
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

export default Home;