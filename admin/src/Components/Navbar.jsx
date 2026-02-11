import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Database, Trophy, UserCircle, FlaskConical } from 'lucide-react'

const Navbar = () => {
    const adminData = useSelector(state => state.admin.adminData);

    // Active link styling helper
    const activeClass = ({ isActive }) => 
        `flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
            isActive 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`;

    return (
        <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
                
                {/* Brand Logo */}
                <NavLink to='/' className="flex items-center gap-2 group">
                    <div className="bg-purple-600 p-2 rounded-lg transition-transform group-hover:rotate-12">
                        <FlaskConical className="text-white size-5" />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tight uppercase">
                        Asan<span className="text-purple-600">Vigyan</span>
                    </span>
                </NavLink>

                {/* Central Navigation */}
                <div className="hidden md:flex flex-row items-center gap-2">
                    <NavLink to='/' className={activeClass}>
                        <LayoutDashboard size={18} />
                        <span className="text-sm">History</span>
                    </NavLink>
                    
                    <NavLink to='/q' className={activeClass} end={false}>
                        <Database size={18} />
                        <span className="text-sm">Questions</span>
                    </NavLink>
                    
                    <NavLink to='/leaderboard' className={activeClass}>
                        <Trophy size={18} />
                        <span className="text-sm">Leaderboard</span>
                    </NavLink>
                </div>

                {/* Profile Section */}
                <NavLink to='/profile' className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-slate-800 leading-none uppercase">Admin</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{adminData?.username || 'Portal'}</p>
                    </div>
                    
                    <div className="relative">
                        {adminData?.profileImage ? (
                            <div className="size-10 rounded-xl overflow-hidden ring-2 ring-slate-100 ring-offset-2 transition-all group-hover:ring-purple-500">
                                <img src={adminData.profileImage} alt="Admin" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all group-hover:bg-purple-100 group-hover:text-purple-600">
                                <UserCircle size={24} />
                            </div>
                        )}
                        {/* Online Status Dot */}
                        <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                </NavLink>
            </div>
        </nav>
    )
}

export default Navbar