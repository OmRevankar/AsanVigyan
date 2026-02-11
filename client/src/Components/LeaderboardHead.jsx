import React from 'react'
import { NavLink } from 'react-router-dom'
import { Trophy, Award, BarChart3 } from 'lucide-react'

const LeaderboardHead = () => {
  // Common styles for the tabs
  const tabBase = "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ease-in-out";
  const activeTab = "bg-white text-purple-600 shadow-sm ring-1 ring-slate-200/50";
  const inactiveTab = "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50";

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      <div className="bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl flex flex-wrap md:flex-row gap-1">
        
        <NavLink 
          to='/leaderboard'
          end
          className={({ isActive }) => `${tabBase} ${isActive ? activeTab : inactiveTab} flex-1 justify-center`}
        >
          <Trophy size={18} />
          <span>High Score</span>
        </NavLink>

        <NavLink 
          to='/leaderboard/total-score' 
          className={({ isActive }) => `${tabBase} ${isActive ? activeTab : inactiveTab} flex-1 justify-center`}
        >
          <Award size={18} />
          <span>Total Score</span>
        </NavLink>

        <NavLink 
          to='/leaderboard/total-attempts' 
          className={({ isActive }) => `${tabBase} ${isActive ? activeTab : inactiveTab} flex-1 justify-center`}
        >
          <BarChart3 size={18} />
          <span>Most Active</span>
        </NavLink>

      </div>
      
    </div>
  )
}

export default LeaderboardHead