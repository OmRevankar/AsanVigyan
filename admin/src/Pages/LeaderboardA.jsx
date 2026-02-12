import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import LeaderboardNavbar from '../Components/LeaderboardNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { highScore } from '../Slices/leaderboardSlice';
import { Trophy, User, ArrowUpRight, Hash, Star } from 'lucide-react';
import { avatarFunction } from '../Helper/avatarSelector';

const LeaderboardA = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.leaderboard.highScore);
  const auth = useSelector((state) => state.admin.isAuthenticated);

  useEffect(() => {
    dispatch(highScore())
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

      {/* Secondary Admin Navigation for Leaderboard Types */}
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
              <Trophy className="text-amber-500 shrink-0" size={28} />
              High Score Rankings
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Viewing top performing users based on single-session high scores.</p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest self-start md:self-center">
            BEST ATTEMPTS
          </div>
        </div>

        {/* Admin Data Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header - Hidden on very small screens for better UX */}
          <div className="hidden sm:grid grid-cols-12 px-8 py-5 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <div className="col-span-2 flex items-center gap-2">
              <Hash size={12} /> Rank
            </div>
            <div className="col-span-6 flex items-center gap-2">
              <User size={12} /> User Profile
            </div>
            <div className="col-span-4 text-right flex items-center justify-end gap-2">
              <Star size={12} className="text-purple-500" /> High Score
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((item, i) => {
                const rank = i + 1;
                return (
                  <div
                    key={item.userId || i}
                    className="flex flex-col sm:grid sm:grid-cols-12 px-5 sm:px-8 py-4 sm:py-5 items-center hover:bg-slate-50/80 transition-colors group gap-4 sm:gap-0"
                  >
                    {/* Rank & User Info Container for Mobile */}
                    <div className="flex items-center justify-between w-full sm:col-span-8">
                      <div className="flex items-center gap-4">
                        {/* Rank Column */}
                        <div className="flex-shrink-0">
                          <span className={`size-8 md:size-9 rounded-lg flex items-center justify-center font-black text-sm
                            ${rank === 1 ? 'bg-amber-100 text-amber-600' :
                              rank === 2 ? 'bg-slate-100 text-slate-500' :
                                rank === 3 ? 'bg-orange-100 text-orange-700' :
                                  'bg-slate-50 text-slate-400'}`}
                          >
                            {rank}
                          </span>
                        </div>

                        {/* User Column */}
                        <NavLink
                          to={`/u/${item.userId}`}
                          className="flex items-center gap-3 group/link min-w-0"
                        >
                          <div className="size-10 md:size-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex-shrink-0">
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
                              {item.avatar || 'Panda'}
                            </p>
                          </div>
                        </NavLink>
                      </div>

                      {/* Score display for Mobile (hidden on desktop) */}
                      <div className="sm:hidden text-right shrink-0">
                         <span className="text-lg font-black text-slate-800 tracking-tight">
                          {item.score.toLocaleString()}
                        </span>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                      </div>
                    </div>

                    {/* Score Column for Desktop */}
                    <div className="hidden sm:block col-span-4 text-right">
                      <span className="text-xl font-black text-slate-800 tracking-tight">
                        {item.score.toLocaleString()}
                      </span>
                      <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pts</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <Trophy size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Rankings Found</p>
              </div>
            )}
          </div>
        </div>

        {/* Table Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 px-4">
          <p className="text-[10px] md:text-xs text-slate-400 font-medium text-center sm:text-left">
            Showing top {data.length} performers in the High Score category.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardA;