import React from 'react'
import { NavLink } from 'react-router-dom'
import { Trophy, Award, BarChart3 } from 'lucide-react'

const LeaderboardHead = () => {
  // Enhanced base styles for better touch targets on mobile
  const tabBase = "flex items-center gap-2 px-3 md:px-6 py-2.5 rounded-xl text-[11px] md:text-sm font-black uppercase tracking-wider transition-all duration-200 ease-in-out whitespace-nowrap";
  const activeTab = "bg-white text-purple-600 shadow-md shadow-purple-100 ring-1 ring-slate-200/50 scale-[1.02]";
  const inactiveTab = "text-slate-500 hover:text-purple-500 hover:bg-white/50";

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      {/* Container changes: 
          - flex-nowrap + overflow-x-auto allows scrolling on tiny screens instead of breaking the layout
          - scrollbar-hide ensures it looks clean
      */}
      <div className="bg-slate-200/60 p-1.5 rounded-[1.25rem] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        
        <NavLink 
          to='/leaderboard'
          end
          className={({ isActive }) => `${tabBase} ${isActive ? activeTab : inactiveTab} flex-1 justify-center min-w-fit`}
        >
          <Trophy size={16} className="md:size-[18px]" />
          <span>High Score</span>
        </NavLink>

        <NavLink 
          to='/leaderboard/total-score' 
          className={({ isActive }) => `${tabBase} ${isActive ? activeTab : inactiveTab} flex-1 justify-center min-w-fit`}
        >
          <Award size={16} className="md:size-[18px]" />
          <span>Total Score</span>
        </NavLink>

        <NavLink 
          to='/leaderboard/total-attempts' 
          className={({ isActive }) => `${tabBase} ${isActive ? activeTab : inactiveTab} flex-1 justify-center min-w-fit`}
        >
          <BarChart3 size={16} className="md:size-[18px]" />
          <span>Most Active</span>
        </NavLink>

      </div>
    </div>
  )
}

export default LeaderboardHead