import React, { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Star, Award, Zap } from 'lucide-react'

const LeaderboardNavbar = () => {
  const location = useLocation();
  const scrollContainerRef = useRef(null);

  // Effect to center the active tab when the route changes
  useEffect(() => {
    const activeTab = scrollContainerRef.current?.querySelector('.active-tab-scroll');
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [location.pathname]);

  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[12px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap scroll-snap-align-center ${
      isActive
        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-y-[-2px] active-tab-scroll'
        : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <div className="flex flex-row justify-center items-center py-4  bg-slate-50 px-4">
      <div 
        ref={scrollContainerRef}
        className="flex flex-row p-1.5 pt-2 bg-slate-100/50 rounded-[2rem] gap-1 overflow-x-auto no-scrollbar max-w-full scroll-smooth"
        style={{ scrollSnapType: 'x proximity', scrollPadding: '0 20px' }}
      >
        
        <NavLink to='/leaderboard' className={tabClass} end>
          <Star size={14} className="shrink-0" />
          <span>Highest Score</span>
        </NavLink>

        <NavLink to='/leaderboard/total-score' className={tabClass}>
          <Award size={14} className="shrink-0" />
          <span>Total Score</span>
        </NavLink>

        <NavLink to='/leaderboard/highest-attempts' className={tabClass}>
          <Zap size={14} className="shrink-0" />
          <span>Most Active</span>
        </NavLink>

      </div>
    </div>
  )
}

export default LeaderboardNavbar