import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTestHistory } from '../Slices/testSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../Slices/userSlice';
import { X, OctagonMinus, Check, LogOut, Edit3, Award, Zap, Target, Calendar, Clock } from 'lucide-react';
import Navbar from '../Components/Navbar';

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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <LogOut className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sign Out</h3>
          <p className="text-slate-500 mt-2">Are you sure you want to log out of your account?</p>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={logout} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors">Logout</button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userData = useSelector(state => state.user.userData);
  const testHistory = useSelector(state => state.test.testHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { dispatch(fetchUserTestHistory()); }, [dispatch]);

  const formatDOB = (dob) => dob ? new Date(dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: "numeric" }) : 'N/A';
  const formatTime = (time) => time ? new Date(time).toLocaleString(undefined, { hour: "numeric", minute: "2-digit", hour12: true }) : "N/A";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <LogoutDialogue isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img src={userData.profileImage} alt="Profile" className="size-32 rounded-3xl object-cover ring-4 ring-purple-50" />
              <button onClick={() => navigate('/update')} className="absolute -bottom-2 -right-2 p-2 bg-white shadow-lg rounded-xl border border-slate-100 text-purple-600 hover:text-purple-700">
                <Edit3 size={18} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800">{userData.fullName}</h1>
              <p className="text-slate-500 font-medium">@{userData.username}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-semibold">
                  <Calendar size={14} /> Born {formatDOB(userData.dob)}
                </span>
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <Zap className="mx-auto mb-1 text-amber-500" size={20} />
                <p className="text-2xl font-bold text-slate-800">{userData.highScore}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">High Score</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <Target className="mx-auto mb-1 text-purple-600" size={20} />
                <p className="text-2xl font-bold text-slate-800">{userData.totalAttempts}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">Tests</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center hidden sm:block">
                <Award className="mx-auto mb-1 text-blue-500" size={20} />
                <p className="text-2xl font-bold text-slate-800">{userData.totalScore}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test History Section */}
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="text-purple-600" /> Recent Activity
        </h2>

        <div className="space-y-6">
          {testHistory.map((test, i) => (
            <div key={test.uid} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Test Header */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="size-10 flex items-center justify-center bg-purple-600 text-white rounded-xl font-bold">{i + 1}</span>
                  <div>
                    {/* <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Attempt #{test._id}</h3> */}
                    <p className="text-sm text-slate-500">{formatDOB(test.createdAt)} • {formatTime(test.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 font-medium">Score Achieved</p>
                  <p className="text-xl font-black text-purple-600">{test.score} <span className="text-sm font-normal text-slate-400">pts</span></p>
                </div>
              </div>

              {/* Responses List */}
              <div className="p-4 space-y-3">
                {test.responses.map((qn, j) => (
                  <div key={qn.uid} className={`rounded-xl border p-4 transition-all ${qn.status === 'correct' ? 'border-green-100 bg-green-50/30' : qn.status === 'incorrect' ? 'border-red-100 bg-red-50/30' : 'border-amber-100 bg-amber-50/30'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-semibold text-slate-700 leading-tight flex-1">
                        <span className="text-slate-400 mr-2">{j+1}.</span>{qn.question.description}
                      </p>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{qn.score}/{qn.question.value}</span>
                        {qn.status === "correct" ? <Check className="text-green-600" size={18} /> : (qn.status === "incorrect" ? <X className="text-red-600" size={18} /> : <OctagonMinus className="text-amber-600" size={18} />)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {qn.question.options.map((opt) => {
                        const isCorrect = opt.id === qn.question.correctOption;
                        const isSelected = opt.id === qn.selectedOption;
                        
                        return (
                          <div key={opt.id} className={`text-sm p-2 rounded-lg border flex justify-between items-center
                            ${isCorrect ? 'bg-green-100 border-green-200 text-green-800 font-medium' : 
                              isSelected && !isCorrect ? 'bg-red-100 border-red-200 text-red-800' : 
                              'bg-white border-slate-100 text-slate-500'}`}>
                            <span>{opt.text}</span>
                            {isCorrect && <Check size={14} />}
                            {isSelected && !isCorrect && <X size={14} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;