import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startTest, submitTest } from '../Slices/testSlice';
import { 
  Timer, AlertCircle, ChevronLeft, ChevronRight, 
  Send, Info, CheckCircle2, Trophy, Loader2, Languages
} from 'lucide-react';

const Game = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const GAME_STATE = {
    MODE_SELECTION: "mode_selection", // New Stage
    INSTRUCTION: "instruction",
    TEST: "test",
    REDIRECT: "redirect"
  };

  const { testData, questionData, isLoading } = useSelector(state => state.test);

  const [responses, setResponses] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.MODE_SELECTION); // Start here
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [index, setIndex] = useState(0);

  const [testTimer, setTestTimer] = useState(60); 
  const [redirectTimer, setRedirectTimer] = useState(10);
  const [instructionTimer, setInstructionTimer] = useState(10);

  // --- LOCKDOWN MECHANISM ---
  useEffect(() => {
    if (gameState === GAME_STATE.TEST) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = "Test in progress. Leaving will forfeit your score.";
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [gameState]);

  // --- TIMERS ---

  // Instruction Timer
  useEffect(() => {
    if (gameState !== GAME_STATE.INSTRUCTION) return;

    const data = {
      category : selectedLanguage
    }

    dispatch(startTest(data)).unwrap().then((res) => {
      setResponses(res.data.map(qn => ({ uid: qn.uid, selectedOption: 0 })));
    }).catch(console.error);

    const interval = setInterval(() => {
      setInstructionTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState(GAME_STATE.TEST);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, dispatch]);

  // Test Timer
  useEffect(() => {
    if (gameState !== GAME_STATE.TEST) return;

    const interval = setInterval(() => {
      setTestTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, responses]);

  // Redirect Timer
  useEffect(() => {
    if (gameState !== GAME_STATE.REDIRECT) return;
    const interval = setInterval(() => {
      setRedirectTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/profile');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, navigate]);

  // --- HANDLERS ---

  const handleSubmit = () => {
    dispatch(submitTest({ response: responses }));
    setGameState(GAME_STATE.REDIRECT);
  };

  const selectOption = (uid, selectedOption) => {
    setResponses(prev => prev.map(r => r.uid === uid ? { ...r, selectedOption } : r));
  };

  const handleModeSelection = (lang) => {
    setSelectedLanguage(lang);
    setGameState(GAME_STATE.INSTRUCTION);
  };

  // --- UI STAGES ---

  // 0. MODE SELECTION POPUP (NEW)
  if (gameState === GAME_STATE.MODE_SELECTION) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-sm w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="size-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Languages size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Select Test Mode</h2>
            <h3 className="text-lg font-bold text-slate-500 mb-8">परीक्षा मोड निवडा</h3>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              <button 
                onClick={() => handleModeSelection('10th_Semi_English')}
                className="w-full py-4 bg-slate-50 hover:bg-purple-600 hover:text-white text-slate-700 font-black rounded-2xl transition-all border-2 border-slate-100 hover:border-purple-600 active:scale-95"
              >
                10th SEMI - ENGLISH
              </button>
              <button 
                onClick={() => handleModeSelection('10th_Marathi')}
                className="w-full py-4 bg-slate-50 hover:bg-purple-600 hover:text-white text-slate-700 font-black rounded-2xl transition-all border-2 border-slate-100 hover:border-purple-600 active:scale-95"
              >
                10th मराठी (MARATHI)
              </button>
              <button 
                onClick={() => handleModeSelection('Kids')}
                className="w-full py-4 bg-slate-50 hover:bg-purple-600 hover:text-white text-slate-700 font-black rounded-2xl transition-all border-2 border-slate-100 hover:border-purple-600 active:scale-95"
              >
                Kids
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1. INSTRUCTION UI
  if (gameState === GAME_STATE.INSTRUCTION) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <div className="flex flex-col items-center text-center">
            <div className="size-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Info className="text-purple-600 size-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Test Instructions</h1>
            <p className="text-xs font-bold text-purple-500 mb-4 tracking-widest uppercase">Mode: {selectedLanguage}</p>
            <div className="my-6 space-y-3 w-full">
              {[
                `Test starts in ${instructionTimer} seconds`,
                "Attempt as many questions as possible",
                "Refreshing or exiting will void the test",
                "Results are generated instantly after submission"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-xl text-slate-600 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-purple-500" />
                  {text}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setGameState(GAME_STATE.TEST)}
              className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. TEST UI (Logic untouched as requested)
  if (gameState === GAME_STATE.TEST) {
    if (isLoading || !questionData.length) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
          <p className="font-bold text-slate-400">Syncing with server...</p>
        </div>
      );
    }

    const qn = questionData[index];
    const selectedOpt = responses.find(r => r.uid === qn.uid)?.selectedOption;

    return (
      <div className="min-h-screen bg-white md:bg-slate-50 flex flex-col">
        {/* Navbar-style Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg font-bold text-xs uppercase tracking-widest">
              Live Test ({selectedLanguage})
            </div>
            <h2 className="hidden md:block font-bold text-slate-700">Question {index + 1} of {questionData.length}</h2>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${testTimer < 10 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Timer size={18} />
            {Math.floor(testTimer / 60)}:{String(testTimer % 60).padStart(2, '0')}
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 p-6 flex-1">
          {/* Main Question Area */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Value: {qn.value} Points</span>
                <span className="text-xs text-slate-300">ID: {qn.uid}</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-8">
                {qn.description}
              </h3>

              {qn.questionImage && (
                <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100">
                  <img src={qn.questionImage} alt="Visual aid" className="w-full h-auto max-h-80 object-contain bg-slate-50" />
                </div>
              )}

              <div className="space-y-3">
                {qn.options.map((opt) => (
                  <button 
                    key={opt.id} 
                    onClick={() => selectOption(qn.uid, opt.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group
                      ${selectedOpt === opt.id 
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md' 
                        : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'}`}
                  >
                    <span className="font-semibold">{opt.text}</span>
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center 
                      ${selectedOpt === opt.id ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-200'}`}>
                      {selectedOpt === opt.id && <div className="size-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-auto pb-10">
              <button 
                onClick={() => setIndex(prev => prev - 1)} 
                disabled={index === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              
              <div className="flex gap-2">
                {index === questionData.length - 1 ? (
                  <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                  >
                    Submit Test <Send size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIndex(prev => prev + 1)}
                    className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
                  >
                    Next Question <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="md:col-span-4 hidden md:block">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-purple-500" /> Progress
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {questionData.map((q, i) => {
                  const answered = responses.find(r => r.uid === q.uid)?.selectedOption !== 0;
                  return (
                    <button 
                      key={q.uid}
                      onClick={() => setIndex(i)}
                      className={`size-10 rounded-xl font-bold text-sm transition-all
                        ${index === i ? 'ring-2 ring-purple-600 ring-offset-2' : ''}
                        ${answered ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 text-xs text-slate-400 leading-relaxed">
                Tip: Answer all questions. Unattempted questions yield 0 points.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULT UI (Logic untouched as requested)
  if (gameState === GAME_STATE.REDIRECT) {
    const testResp = testData?.[0];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100">
          <div className="relative inline-block mb-6">
            <div className="size-24 bg-amber-50 rounded-full flex items-center justify-center">
              <Trophy className="text-amber-500 size-12" />
            </div>
            <div className="absolute -top-2 -right-2 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-black animate-bounce">
              DONE!
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Test Completed</h1>
          <p className="text-slate-500 mt-2 font-medium">Redirecting to home in <span className="text-purple-600">{redirectTimer}s</span></p>

          <div className="mt-8 mb-10 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Total Score</p>
             <p className="text-6xl font-black text-purple-600">{testResp?.score || 0}</p>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Game;