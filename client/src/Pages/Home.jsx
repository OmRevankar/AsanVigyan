import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Sparkles } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 overflow-x-hidden">
      <Navbar />

      <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16 z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs md:text-sm font-bold mb-6 tracking-wide uppercase">
            <Sparkles size={14} /> PLAY N LEARN
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            Ready for a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
              Challenge?
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-xl max-w-md mx-auto leading-relaxed font-medium">
            Test your knowledge, climb the ranks, and prove you're the best among your peers.
          </p>
        </motion.div>

        {/* The Large Circular Play Button */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="relative group"
        >
          {/* Animated Background Pulse */}
          <div className="absolute -inset-6 bg-purple-200 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          <button 
            onClick={() => navigate('/game')}
            className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-purple-600 rounded-full shadow-[0_20px_50px_rgba(147,51,234,0.3)] hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 ease-out border-[6px] md:border-[10px] border-white group"
          >
            <div className="flex flex-col items-center">
              <Play 
                size={window.innerWidth < 640 ? 48 : 72} 
                fill="white" 
                className="text-white ml-2 transition-transform group-hover:rotate-12" 
              />
              <span className="text-white font-black text-lg md:text-2xl mt-2 tracking-[0.2em] uppercase">Start</span>
            </div>
          </button>

          {/* Floating Stats Hint (Optional Aesthetic) */}
          <div className="absolute -right-4 -top-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-50 hidden md:block animate-bounce">
            <Trophy className="text-amber-500" size={24} />
          </div>
        </motion.div>

        {/* Secondary Action: Leaderboard */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-20 z-10"
        >
          <button 
            onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-3 px-10 py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-purple-200 hover:text-purple-600 transition-all duration-300 shadow-sm"
          >
            <Trophy size={20} />
            View Leaderboards
          </button>
        </motion.div>

        {/* Background Decorative Blobs - More responsive positioning */}
        <div className="absolute top-1/4 left-[5%] w-32 h-32 md:w-64 md:h-64 bg-purple-100 rounded-full -z-10 blur-[60px] md:blur-[100px] opacity-60"></div>
        <div className="absolute bottom-1/4 right-[5%] w-40 h-40 md:w-80 md:h-80 bg-indigo-100 rounded-full -z-10 blur-[60px] md:blur-[100px] opacity-60"></div>
      </main>
    </div>
  );
};

export default Home;