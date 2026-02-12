import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Menu, X, FlaskConical, Trophy, User } from 'lucide-react'; 
import { avatarFunction } from '../Helper/avatarSelector';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const userData = useSelector((state) => state.user.userData);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left: Logo Section */}
          <NavLink to='/' className="flex items-center gap-2 group z-50">
            <div className="bg-purple-600 p-2 rounded-lg transition-transform group-hover:rotate-12">
              <FlaskConical className="text-white size-5" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight uppercase">
              Asan<span className="text-purple-600">Vigyan</span>
            </span>
          </NavLink>

          {/* Center: Navigation Links (HIDDEN ON MOBILE) */}
          <div className="hidden md:flex items-center gap-8">
            {location.pathname !== '/' && (
              <NavLink
                to="/"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors"
              >
                <Home size={18} />
                <span>Home</span>
              </NavLink>
            )}

            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-purple-600' : 'text-slate-500 hover:text-purple-600'}`
              }
            >
              Leaderboards
            </NavLink>
          </div>

          {/* Right: Profile & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Profile Info */}
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">
                {userData?.username || 'Login'}
              </p>
              <p className="text-xs text-slate-400 mt-1">{userData?.username ? "ASANVIGYAN" : 'GUEST'}</p>
            </div>

            <NavLink
              to="/profile"
              className="relative group transition-transform hover:scale-105 active:scale-95 hidden md:block"
            >
              <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
              <img
                src={avatarFunction(userData?.avatar) || 'https://images.unsplash.com/photo-1705904506562-f28266845273?fit=max&q=80'}
                alt="Profile"
                className="relative size-10 rounded-full border-2 border-white object-cover shadow-sm"
              />
            </NavLink>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white border-b border-slate-100 shadow-xl">
          <NavLink
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-all"
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/leaderboard"
            onClick={closeMenu}
            className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-all"
          >
            <Trophy size={20} />
            <span className="font-medium">Leaderboards</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-800 mt-4"
          >
            <img
              src={avatarFunction(userData?.avatar) || 'https://images.unsplash.com/photo-1705904506562-f28266845273?fit=max&q=80' }
              alt="Profile"
              className="size-8 rounded-full object-cover border border-purple-200"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">{userData?.username || 'Guest'}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">View Profile</span>
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;