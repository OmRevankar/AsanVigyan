import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAll, searchFullName, sortByFullName, sortByLatest, sortByMarksAscend, sortByMarksDesc, sortByOldest } from '../Slices/testSlice';
import { Check, OctagonMinus, X, ChevronDown, ChevronUp, User, Clock, Calendar, Activity, ListChecks, Search, Filter } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { avatarFunction } from '../Helper/avatarSelector';

const Home = () => {
  const dispatch = useDispatch();
  const testHistory = useSelector(state => state.test.testHistory);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      dispatch(fetchAll()); // Reset list when search is cleared
    } else {
      dispatch(searchFullName({ keyword: value }));
    }
  };

  const handleSort = (type) => {
    switch (type) {
      case 'user': dispatch(sortByFullName({cat:'all'})); break;
      case 'latest': dispatch(sortByLatest({cat:'all'})); break;
      case 'oldest': dispatch(sortByOldest({cat:'all'})); break;
      case 'desc': dispatch(sortByMarksDesc({cat:'all'})); break;
      case 'asc': dispatch(sortByMarksAscend({cat:'all'})); break;
      default: break;
    }
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Clock className="text-purple-600" /> Recent Activity
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search Full Name of User..."
                className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all w-64"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <Filter size={16} className="text-purple-600 mr-2" />
              <select
                onChange={(e) => handleSort(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="user">Full Name (A-Z)</option>
                <option value="desc">Marks: High to Low</option>
                <option value="asc">Marks: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test Activity List */}
        <div className="space-y-4">
          {
            testHistory.length > 0 ?
              testHistory.map((test, i) => {
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
                        <img src={avatarFunction(test.avatar)} alt="" className='rounded-full w-15 h-15' />
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
              }) : (
                <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No records found
                  </p>
                </div>
              )

          }
        </div>
      </main>
    </div>
  );
};

export default Home;