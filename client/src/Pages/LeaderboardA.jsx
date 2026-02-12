import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { highScore } from '../Slices/leaderboardSlice';
import { useNavigate } from 'react-router-dom';
import { Trophy, Crown, Zap, ChevronRight } from 'lucide-react';
import LeaderboardHead from '../Components/LeaderboardHead';
import Navbar from '../Components/Navbar';
import { avatarFunction } from '../Helper/avatarSelector';
import { motion } from 'framer-motion';

const LeaderboardA = () => {
    const dispatch = useDispatch();
    const leaderboard = useSelector((state) => state.leaderboard.highScore);
    const auth = useSelector((state) => state.user.isAuthenticated);
    const user = useSelector((state) => state.user.userData);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(highScore())
            .unwrap()
            .catch((e) => {
                if (auth) setTimeout(() => { window.location.reload() }, 1000);
            });
    }, [dispatch, auth]);

    const topThree = leaderboard.slice(0, 3);
    const theRest = leaderboard.slice(3);

    const handleUserClick = (targetUserId) => {
        targetUserId === user._id ? navigate(`/profile`) : navigate(`/u/${targetUserId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />
            <LeaderboardHead />

            <div className="max-w-4xl mx-auto px-4 mt-6 md:mt-12">
                
                {/* Podium Section - Optimized for all screens */}
                <div className="flex items-end justify-center gap-2 md:gap-4 mb-12 pt-8 md:pt-12 px-1">
                    {topThree.map((item, index) => {
                        const isFirst = index === 0;
                        const isSecond = index === 1;
                        const isCurrentUser = item.userId === user._id;

                        // Visual configuration based on rank
                        const config = isFirst 
                            ? { order: 'order-2', height: 'h-40 md:h-56', size: 'size-24 md:size-32', icon: 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png', border: 'border-amber-400' }
                            : index === 1 
                                ? { order: 'order-1', height: 'h-32 md:h-44', size: 'size-20 md:size-28', icon: 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png', border: 'border-slate-300' }
                                : { order: 'order-3', height: 'h-28 md:h-36', size: 'size-18 md:size-24', icon: 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png', border: 'border-orange-300' };

                        return (
                            <div key={item.userId} className={`flex flex-col items-center flex-1 max-w-[120px] md:max-w-[200px] ${config.order}`}>
                                <div className="relative mb-3 group cursor-pointer" onClick={() => handleUserClick(item.userId)}>
                                    {isFirst && (
                                        <motion.div 
                                            animate={{ y: [0, -8, 0] }} 
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
                                        >
                                            <Crown className="text-amber-500" size={window.innerWidth < 768 ? 28 : 40} fill="currentColor" />
                                        </motion.div>
                                    )}
                                    <div className={`relative ${config.size} rounded-full bg-white border-4 ${config.border} shadow-xl p-1 transition-transform group-hover:scale-110`}>
                                        <img src={config.icon} alt="rank" className="w-full h-full object-contain" />
                                    </div>
                                </div>

                                <div className={`w-full ${config.height} rounded-t-[2rem] shadow-sm border border-b-0 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden ${isCurrentUser ? 'bg-purple-600 border-purple-400 ring-2 ring-purple-500/20' : 'bg-white border-slate-100'}`}>
                                    <span className={`absolute -bottom-1 right-0 text-5xl md:text-7xl font-black leading-none select-none opacity-10 ${isCurrentUser ? 'text-white' : 'text-slate-200'}`}>
                                        {index + 1}
                                    </span>

                                    <p className={`font-black truncate w-full px-1 text-xs md:text-lg relative z-10 mb-1 ${isCurrentUser ? 'text-white' : 'text-slate-800'}`}>
                                        {item.username}
                                    </p>

                                    <div className="relative z-10">
                                        <p className={`font-black text-xl md:text-4xl ${isCurrentUser ? 'text-white' : 'text-purple-600'}`}>{item.score}</p>
                                        <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${isCurrentUser ? 'text-purple-100' : 'text-slate-400'}`}>Points</p>
                                    </div>

                                    {isCurrentUser && (
                                        <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                            <div className="bg-white/20 p-1 rounded-full animate-pulse">
                                                <Zap size={10} className="text-white fill-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Table Section */}
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header - Hidden on very small screens, or simplified */}
                    <div className="hidden sm:grid grid-cols-12 px-8 py-5 border-b border-slate-50 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="col-span-2">Rank</div>
                        <div className="col-span-7">Player</div>
                        <div className="col-span-3 text-right">Score</div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {theRest.map((item, index) => {
                            const actualRank = index + 4;
                            const isCurrentUser = item.userId === user._id;

                            return (
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    key={item.userId}
                                    className={`grid grid-cols-12 px-5 md:px-8 py-4 md:py-6 items-center transition-all cursor-pointer ${isCurrentUser ? 'bg-purple-50/80' : 'hover:bg-slate-50'}`}
                                    onClick={() => handleUserClick(item.userId)}
                                >
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center justify-center size-8 md:size-10 rounded-xl font-black text-sm md:text-base ${isCurrentUser ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-slate-100 text-slate-500'}`}>
                                            {actualRank}
                                        </span>
                                    </div>

                                    <div className="col-span-7 flex items-center gap-3 md:gap-5">
                                        <div className="relative">
                                            <img src={avatarFunction(item.avatar)} className='rounded-2xl size-10 md:size-14 object-cover border-2 border-white shadow-sm' alt="" />
                                            {isCurrentUser && <div className="absolute -top-1 -right-1 size-3 bg-green-500 border-2 border-white rounded-full"></div>}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`font-black text-sm md:text-lg truncate ${isCurrentUser ? 'text-purple-700' : 'text-slate-700'}`}>
                                                {item.username}
                                            </p>
                                            <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-tight">LEVEL {(item.score / 100).toFixed(0)}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-3 flex items-center justify-end gap-2">
                                        <span className={`font-black text-lg md:text-2xl tracking-tight ${isCurrentUser ? 'text-purple-600' : 'text-slate-800'}`}>
                                            {item.score.toLocaleString()}
                                        </span>
                                        <ChevronRight size={16} className="text-slate-300 hidden md:block" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-24">
                        <div className="bg-slate-100 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No rankings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardA;