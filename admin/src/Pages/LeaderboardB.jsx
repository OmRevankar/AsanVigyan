import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import LeaderboardNavbar from '../Components/LeaderboardNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { totalScore } from '../Slices/leaderboardSlice';
import { NavLink } from 'react-router-dom';
import { Award, User, ArrowUpRight, Hash, Activity } from 'lucide-react';
import { avatarFunction } from '../Helper/avatarSelector';

const LeaderboardB = () => {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.leaderboard.totalScore);
  const auth = useSelector((state) => state.admin.isAuthenticated);

  useEffect(() => {
    dispatch(totalScore())
    .unwrap()
    .then(() => {})
    .catch((e) => {
      if(auth){
        setTimeout(()=>{
          window.location.reload();
        },1000)
      }
    })
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Secondary Admin Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-screen mx-auto">
          <LeaderboardNavbar />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Award className="text-indigo-500" size={28} />
              Lifetime Standings
            </h1>
            <p className="text-slate-500 font-medium">Aggregated total points across all tests attempted by users.</p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest">
            LIFETIME BESTS
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
              <Activity size={12} className="text-indigo-500" /> Lifetime Score
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((item, i) => {
                console.log(item.avatar)
                const rank = i + 1;
                return (
                  <div
                    key={item._id || i}
                    className="grid grid-cols-12 px-8 py-5 items-center hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Rank Column */}
                    <div className="col-span-2">
                      <span className={`size-8 rounded-lg flex items-center justify-center font-black text-sm
                        ${rank <= 3 ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100' : 'bg-slate-50 text-slate-400'}`}
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
                        {/* Avatar Image Implementation */}
                        <div className="rounded-full size-10 bg-indigo-50 rounded-xl flex items-center justify-center overflow-hidden border border-indigo-100">
                          <img
                            src={avatarFunction(item.avatar)}
                            alt={item.username}
                            className="rounded-full w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <p className="font-bold text-slate-700 group-hover/link:text-indigo-600 transition-colors flex items-center gap-1">
                            {item.username}
                            <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-all transform translate-y-1 group-hover/link:translate-y-0" />
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                            UID: {item._id.slice(-8)}
                          </p>
                        </div>
                      </NavLink>
                    </div>

                    {/* Score Column */}
                    <div className="col-span-4 text-right">
                      <span className="text-xl font-black text-slate-800 tracking-tight">
                        {item.lifeTimeScore.toLocaleString()}
                      </span>
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Total Accumulated</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <Award size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Lifetime Data</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 px-4">
          <p className="text-[11px] text-slate-400 font-medium italic">
            Showing top {data.length} performers in the Lifetime Score category.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardB;