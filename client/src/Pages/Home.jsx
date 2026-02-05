import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy } from 'lucide-react'; // Assuming you use lucide-react for icons
import Navbar from '../Components/Navbar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100">
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Ready for a <span className="text-purple-600">Challenge?</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Test your knowledge, climb the ranks, and prove you're the best.
          </p>
        </div>

        {/* The Large Circular Play Button */}
        <div className="relative group">
          {/* Animated Background Pulse */}
          <div className="absolute -inset-4 bg-purple-100 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          <button 
            onClick={() => navigate('/game')}
            className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 bg-purple-600 rounded-full shadow-2xl shadow-purple-200 hover:bg-purple-700 hover:scale-105 transition-all duration-300 ease-out border-8 border-white group"
          >
            <div className="flex flex-col items-center">
              <Play size={64} fill="white" className="text-white ml-2 transition-transform group-hover:scale-110" />
              <span className="text-white font-bold text-xl mt-2 tracking-widest uppercase">Start</span>
            </div>
          </button>
        </div>

        {/* Secondary Action: Leaderboard */}
        <div className="mt-16">
          <button 
            onClick={() => navigate('/leaderboard-a')}
            className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-purple-100 text-purple-600 font-semibold rounded-full hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
          >
            <Trophy size={20} />
            View Leaderboards
          </button>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-purple-50 rounded-full -z-10 blur-2xl"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-50 rounded-full -z-10 blur-2xl"></div>
      </main>
    </div>
  );
};

export default Home;