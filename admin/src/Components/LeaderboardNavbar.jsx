import React from 'react'
import { NavLink } from 'react-router-dom'
import { Star, Award, Zap } from 'lucide-react'

const LeaderboardNavbar = () => {
  // Helper for active tab styling
  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
      isActive
        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-y-[-2px]'
        : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <div className="flex flex-row justify-center items-center py-4 bg-white">
      <div className="flex flex-row p-1.5 bg-slate-100/50 rounded-[2rem] gap-1">
        
        <NavLink to='/leaderboard-a' className={tabClass}>
          <Star size={14} />
          <span>Highest Score</span>
        </NavLink>

        <NavLink to='/leaderboard-b' className={tabClass}>
          <Award size={14}  />
          <span>Total Score</span>
        </NavLink>

        <NavLink to='/leaderboard-c' className={tabClass}>
          <Zap size={14}  />
          <span>Most Active</span>
        </NavLink>

      </div>
    </div>
  )
}

export default LeaderboardNavbar