import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import LeaderboardNavbar from '../Components/LeaderboardNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { totalAttempts } from '../Slices/leaderboardSlice';
import { NavLink } from 'react-router-dom';
import { Zap, User, ArrowUpRight, Hash, BarChart3 } from 'lucide-react';
import { avatarFunction } from '../Helper/avatarSelector';

const LeaderboardC = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.leaderboard.totalAttempts);
  const auth = useSelector((state) => state.admin.isAuthenticated);

  useEffect(() => {
    dispatch(totalAttempts())
      .unwrap()
      .then(() => { })
      .catch((e) => {
        if (auth) {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      })
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Secondary Admin Navigation */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-screen mx-auto overflow-x-auto no-scrollbar">
          <LeaderboardNavbar />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Zap className="text-purple-600 fill-purple-600 shrink-0" size={28} />
              Activity Leaderboard
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Tracking user engagement based on the total number of tests attempted.</p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest self-start md:self-center">
            Most Active
          </div>
        </div>

        {/* Admin Data Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Table Header - Hidden on Mobile */}
          <div className="hidden sm:grid grid-cols-12 px-8 py-5 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
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
                    className="flex flex-col sm:grid sm:grid-cols-12 px-5 sm:px-8 py-4 sm:py-5 items-center hover:bg-slate-50/80 transition-colors group gap-4 sm:gap-0"
                  >
                    {/* Rank & User Info Container */}
                    <div className="flex items-center justify-between w-full sm:col-span-8">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        {/* Rank Column */}
                        <div className="flex-shrink-0">
                          <span className={`size-8 md:size-9 rounded-lg flex items-center justify-center font-black text-sm
                            ${rank <= 3 ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                          >
                            {rank}
                          </span>
                        </div>

                        {/* User Column */}
                        <NavLink
                          to={`/u/${item._id}`}
                          className="flex items-center gap-3 group/link min-w-0"
                        >
                          <div className="size-10 md:size-11 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-purple-200 group-hover:bg-purple-50 transition-all flex-shrink-0">
                            <img
                              src={avatarFunction(item.avatar)}
                              alt={item.username}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 group-hover/link:text-purple-600 transition-colors flex items-center gap-1 truncate">
                              {item.username}
                              <ArrowUpRight size={14} className="hidden sm:block opacity-0 group-hover/link:opacity-100 transition-all transform translate-y-1 group-hover/link:translate-y-0" />
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight truncate">
                              UID: {item._id.slice(-8)}
                            </p>
                          </div>
                        </NavLink>
                      </div>

                      {/* Mobile Count (hidden on desktop) */}
                      <div className="sm:hidden text-right shrink-0">
                        <span className="text-lg font-black text-slate-800 tracking-tight">
                          {item.attempts}
                        </span>
                        <p className="text-[8px] font-black text-purple-500 uppercase">Attempts</p>
                      </div>
                    </div>

                    {/* Attempts Column for Desktop */}
                    <div className="hidden sm:block col-span-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                          {item.attempts}
                        </span>
                        <div className="h-2 w-12 lg:w-16 bg-slate-100 rounded-full overflow-hidden">
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
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 px-4">
          <p className="text-[10px] md:text-[11px] text-slate-400 font-medium text-center sm:text-left">
            Showing top {data.length} active players.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardC;