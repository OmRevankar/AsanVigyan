import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { highScore } from '../Slices/leaderboardSlice';
import { useNavigate } from 'react-router-dom';
import { Trophy, Crown, Zap } from 'lucide-react';
import LeaderboardHead from '../Components/LeaderboardHead';
import Navbar from '../Components/Navbar';

const LeaderboardA = () => {
  const dispatch = useDispatch();
  const leaderboard = useSelector((state) => state.leaderboard.highScore);
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(highScore());
  }, [dispatch]);

  const topThree = leaderboard.slice(0, 3);
  const theRest = leaderboard.slice(3);

  const handleUserClick = (targetUserId) => {
    // FIX 1: Navigation logic now consistent across all ranks
    targetUserId === user._id ? navigate(`/profile`) : navigate(`/u/${targetUserId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      <LeaderboardHead />

      <div className="max-w-4xl mx-auto px-4 mt-12">
        {/* Podium Section (Top 3) */}
        <div className="grid grid-cols-3 gap-4 items-end mb-12 px-2">
          {topThree.map((item, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;
            
            // FIX 2: Check if this podium user is the logged-in user
            const isCurrentUser = item.userId === user._id;

            const order = isFirst ? 'order-2' : isSecond ? 'order-1' : 'order-3';
            const height = isFirst ? 'h-48' : isSecond ? 'h-36' : 'h-32';

            const rankAssets = {
              0: { img: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png", border: "border-amber-400", shadow: "shadow-amber-200" },
              1: { img: "https://cdn-icons-png.flaticon.com/512/2583/2583319.png", border: "border-slate-300", shadow: "shadow-slate-200" },
              2: { img: "https://cdn-icons-png.flaticon.com/512/2583/2583434.png", border: "border-amber-700/30", shadow: "shadow-amber-700/10" }
            };

            return (
              <div key={item.userId} className={`flex flex-col items-center ${order}`}>
                <div className="relative mb-3">
                  {isFirst && <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce" size={32} fill="currentColor" />}

                  {/* FIX 1 applied here: onClick added to the medallion container */}
                  <div 
                    className={`relative size-20 md:size-24 rounded-full bg-white border-4 ${rankAssets[index].border} ${rankAssets[index].shadow} shadow-xl p-1 transition-transform hover:scale-110 cursor-pointer`}
                    onClick={() => handleUserClick(item.userId)}
                  >
                    <img src={rankAssets[index].img} alt={`Rank ${index + 1}`} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* FIX 2 applied here: Added conditional border and background for "YOU" in podium */}
                <div className={`w-full ${height} ${isCurrentUser ? 'bg-purple-50 border-purple-200 ring-2 ring-purple-500/20' : 'bg-white border-slate-100'} rounded-t-3xl shadow-sm border flex flex-col items-center justify-center p-2 text-center relative overflow-hidden`}>
                  <span className="absolute -bottom-2 right-0 text-6xl font-black text-slate-50 opacity-10 leading-none select-none">
                    {index + 1}
                  </span>

                  <p className={`font-bold truncate w-full px-2 text-sm md:text-base relative z-10 ${isCurrentUser ? 'text-purple-700' : 'text-slate-800'}`}>
                    {item.username}
                  </p>
                  
                  {/* FIX 2: "YOU" tag for Podium */}
                  {isCurrentUser && (
                    <span className="relative z-10 mb-1 text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase font-black">
                      You
                    </span>
                  )}

                  <p className="text-purple-600 font-black text-xl md:text-2xl relative z-10">{item.score}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">Points</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Leaderboard Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="col-span-2">Rank</div>
            <div className="col-span-7">Player</div>
            <div className="col-span-3 text-right flex items-center justify-end gap-1">Score <Zap size={12} className="fill-purple-600 text-purple-600"/></div>
          </div>

          <div className="divide-y divide-slate-50">
            {theRest.map((item, index) => {
              const actualRank = index + 4;
              const isCurrentUser = item.userId === user._id;

              return (
                <div
                  key={item.userId}
                  className={`grid grid-cols-12 px-6 py-4 items-center transition-colors hover:bg-slate-50/50 cursor-pointer ${isCurrentUser ? 'bg-purple-50/50' : ''}`}
                  onClick={() => handleUserClick(item.userId)}
                >
                  <div className="col-span-2">
                    <span className="inline-flex items-center justify-center size-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm">
                      {actualRank}
                    </span>
                  </div>

                  <div className="col-span-7 flex items-center gap-3">
                    <div>
                      <p className={`font-bold text-sm ${isCurrentUser ? 'text-purple-700' : 'text-slate-700'}`}>
                        {item.username} {isCurrentUser && <span className="ml-2 text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full uppercase">You</span>}
                      </p>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">UID: {item.uid}</p>
                    </div>
                  </div>

                  <div className="col-span-3 text-right">
                    <span className="font-black text-slate-800 tracking-tight">{item.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <Trophy size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No rankings yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardA;