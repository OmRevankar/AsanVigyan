import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, User } from 'lucide-react'; // Optional: icons for a dashboard feel

const Navbar = () => {
  const userData = useSelector((state) => state.user.userData);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
              Asan<span className="text-purple-600">Vigyan</span>
            </span>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center gap-8">
            {location.pathname !== '/' && (
              <NavLink 
                to="/" 
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors"
              >
                <Home size={18} />
                <span>Home</span>
              </NavLink>
            )}
            
            {/* You can add more dashboard links here, like 'My Stats' */}
            <NavLink 
              to="/leaderboard-a" 
              className={({isActive}) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-purple-600' : 'text-slate-500 hover:text-purple-600'}`
              }
            >
              Leaderboards
            </NavLink>
          </div>

          {/* Right: Profile Section */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">
                {userData?.username || 'Login'}
              </p>
              <p className="text-xs text-slate-400 mt-1">{userData?.username ? "ASANVIGYAN" : 'GUEST'}</p>
            </div>
            
            <NavLink 
              to="/profile" 
              className="relative group transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
              <img 
                src={userData?.profileImage || 'https://images.unsplash.com/photo-1705904506562-f28266845273?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwzfHx1c2VyJTIwaWNvbnxlbnwwfHx8fDE3NzAzMDI4Mjl8MA&ixlib=rb-4.1.0&fit=max&q=80'} 
                alt="Profile" 
                className="relative size-10 rounded-full border-2 border-white object-cover shadow-sm" 
              />
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;