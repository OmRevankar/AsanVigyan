import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import LeaderboardNavbar from '../Components/LeaderboardNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { totalAttempts } from '../Slices/leaderboardSlice';
import { NavLink } from 'react-router-dom';
import { Zap, User, ArrowUpRight, Hash, BarChart3 } from 'lucide-react';

const LeaderboardC = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.leaderboard.totalAttempts);

  useEffect(() => {
    dispatch(totalAttempts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Secondary Admin Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <LeaderboardNavbar />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Zap className="text-purple-600 fill-purple-600" size={28} />
              Activity Leaderboard
            </h1>
            <p className="text-slate-500 font-medium">Tracking user engagement based on the total number of tests attempted.</p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest">
            Type C (Engagement)
          </div>
        </div>

        {/* Admin Data Table */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-5 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <div className="col-span-2 flex items-center gap-2">
              <Hash size={12} /> Rank
            </div>
            <div className="col-span-6 flex items-center gap-2">
              <User size={12} /> User Profile
            </div>
            <div className="col-span-4 text-right flex items-center justify-end gap-2">
              <BarChart3 size={12} className="text-purple-500" /> Total Attempts
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((item, i) => {
                const rank = i + 1;
                return (
                  <div 
                    key={item._id || i} 
                    className="grid grid-cols-12 px-8 py-5 items-center hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Rank Column */}
                    <div className="col-span-2">
                      <span className={`size-8 rounded-lg flex items-center justify-center font-black text-sm
                        ${rank <= 3 ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* User Column */}
                    <div className="col-span-6">
                      <NavLink 
                        to={`/u/${item._id}`} 
                        className="flex items-center gap-3 group/link"
                      >
                        <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold border border-slate-200 group-hover:border-purple-200 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                          {item.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 group-hover/link:text-purple-600 transition-colors flex items-center gap-1">
                            {item.username}
                            <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-all transform translate-y-1 group-hover/link:translate-y-0" />
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">UID: {item._id.slice(-8)}</p>
                        </div>
                      </NavLink>
                    </div>

                    {/* Attempts Column */}
                    <div className="col-span-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-2xl font-black text-slate-800 tracking-tight">
                          {item.attempts}
                        </span>
                        <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full bg-purple-500 rounded-full" 
                            style={{ width: `${Math.min((item.attempts / (data[0].attempts || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Tests Completed</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <Zap size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Activity Recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex justify-between items-center px-4">
          <p className="text-[11px] text-slate-400 font-medium">
            This list identifies your most loyal and active users.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardC;