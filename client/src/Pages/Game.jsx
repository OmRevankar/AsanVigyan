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
    MODE_SELECTION: "mode_selection",
    INSTRUCTION: "instruction",
    TEST: "test",
    REDIRECT: "redirect"
  };

  const { testData, questionData, isLoading } = useSelector(state => state.test);
  const auth = useSelector((state) => state.user.isAuthenticated);

  const [responses, setResponses] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.MODE_SELECTION);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [index, setIndex] = useState(0);

  const [testTimer, setTestTimer] = useState(60); 
  const [redirectTimer, setRedirectTimer] = useState(10);
  const [instructionTimer, setInstructionTimer] = useState(10);

  // --- LOCKDOWN MECHANISM (Logic Untouched) ---
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

  // --- TIMERS (Logic Untouched) ---
  useEffect(() => {
    if (gameState !== GAME_STATE.INSTRUCTION) return;
    const data = { category : selectedLanguage };
    dispatch(startTest(data)).unwrap().then((res) => {
      setResponses(res.data.map(qn => ({ uid: qn.uid, selectedOption: 0 })));
    }).catch((e) => {
      if(auth){ setTimeout(()=>{ window.location.reload(); }, 1000) }
    });
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
  }, [gameState, dispatch, selectedLanguage, auth, GAME_STATE.TEST, GAME_STATE.INSTRUCTION]);

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
  }, [gameState, navigate, GAME_STATE.REDIRECT]);

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

  // 0. MODE SELECTION POPUP
  if (gameState === GAME_STATE.MODE_SELECTION) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-sm w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="size-14 md:size-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <Languages size={28} />
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Select Test Mode</h2>
            <h3 className="text-base md:text-lg font-bold text-slate-500 mb-6 md:mb-8">परीक्षा मोड निवडा</h3>
            
            <div className="grid grid-cols-1 gap-3 md:gap-4 w-full max-h-[60vh] overflow-y-auto pr-1">
              {['10th_Semi_English', '10th_Marathi', 'Kids'].map((mode) => (
                <button 
                  key={mode}
                  onClick={() => handleModeSelection(mode)}
                  className="w-full py-3 md:py-4 bg-slate-50 hover:bg-purple-600 hover:text-white text-slate-700 font-black rounded-xl md:rounded-2xl transition-all border-2 border-slate-100 hover:border-purple-600 active:scale-95 text-sm md:text-base"
                >
                  {mode.replace(/_/g, ' ')}
                </button>
              ))}
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
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
          <div className="flex flex-col items-center text-center">
            <div className="size-16 md:size-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Info className="text-purple-600 size-8 md:size-10" />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Test Instructions</h1>
            <p className="text-[10px] md:text-xs font-bold text-purple-500 mb-4 tracking-widest uppercase">Mode: {selectedLanguage}</p>
            <div className="my-4 md:my-6 space-y-2 md:space-y-3 w-full">
              {[
                `Test starts in ${instructionTimer} seconds`,
                "Attempt as many questions as possible",
                "Refreshing or exiting will void the test",
                "Results are generated instantly"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-xl text-slate-600 text-xs md:text-sm font-medium">
                  <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setGameState(GAME_STATE.TEST)}
              className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 shadow-lg active:scale-[0.98] transition-all"
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. TEST UI
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
    const progressPercent = ((index + 1) / questionData.length) * 100;

    return (
      <div className="min-h-screen bg-white md:bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <div className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded md:rounded-lg font-bold text-[10px] uppercase tracking-widest w-fit">
                Live Test
              </div>
              <h2 className="text-sm md:text-base font-bold text-slate-700">Q. {index + 1} / {questionData.length}</h2>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-mono font-bold text-sm md:text-base ${testTimer < 10 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
              <Timer size={18} />
              {Math.floor(testTimer / 60)}:{String(testTimer % 60).padStart(2, '0')}
            </div>
          </div>
          {/* Progress Bar (Mobile and Desktop) */}
          <div className="w-full h-1 bg-slate-100">
            <div 
              className="h-full bg-purple-600 transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 p-4 md:p-6 flex-1 pb-32 md:pb-6">
          {/* Main Question Area */}
          <div className="md:col-span-8 flex flex-col gap-4 md:gap-6">
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points: {qn.value}</span>
                <span className="text-[10px] text-slate-300">ID: {qn.uid}</span>
              </div>
              
              <h3 className="text-lg md:text-2xl font-bold text-slate-800 leading-snug mb-6">
                {qn.description}
              </h3>

              {qn.questionImage && (
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-100">
                  <img src={qn.questionImage} alt="Visual aid" className="w-full h-auto max-h-60 md:max-h-80 object-contain bg-slate-50" />
                </div>
              )}

              <div className="space-y-3">
                {qn.options.map((opt) => (
                  <button 
                    key={opt.id} 
                    onClick={() => selectOption(qn.uid, opt.id)}
                    className={`w-full text-left p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all flex items-center justify-between group
                      ${selectedOpt === opt.id 
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm' 
                        : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'}`}
                  >
                    <span className="font-semibold text-sm md:text-base">{opt.text}</span>
                    <div className={`size-5 md:size-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 
                      ${selectedOpt === opt.id ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-200'}`}>
                      {selectedOpt === opt.id && <div className="size-1.5 md:size-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Switcher for Mobile */}
            <div className="md:hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Jump to question</p>
                <div className="flex gap-2 overflow-x-auto p-2 no-scrollbar">
                    {questionData.map((q, i) => {
                        const answered = responses.find(r => r.uid === q.uid)?.selectedOption !== 0;
                        return (
                            <button 
                                key={q.uid}
                                onClick={() => setIndex(i)}
                                className={`size-10 shrink-0 rounded-lg font-bold text-xs transition-all
                                ${index === i ? 'ring-2 ring-purple-600 ring-offset-1' : ''}
                                ${answered ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* Sidebar Navigation (Desktop Only) */}
          <div className="md:col-span-4 hidden md:block">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-purple-500" /> Progress
              </h4>
              <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
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
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 md:relative md:bg-transparent md:border-none md:p-6 mt-auto">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button 
                onClick={() => setIndex(prev => prev - 1)} 
                disabled={index === 0}
                className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-3 rounded-xl font-bold text-slate-600 disabled:opacity-20 hover:bg-slate-100 transition-colors text-sm md:text-base"
              >
                <ChevronLeft size={20} /> <span className="hidden xs:inline">Prev</span>
              </button>
              
              <div className="flex gap-2">
                {index === questionData.length - 1 ? (
                  <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 md:px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all text-sm md:text-base"
                  >
                    Submit <Send size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIndex(prev => prev + 1)}
                    className="flex items-center gap-2 px-6 md:px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all text-sm md:text-base"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>
    );
  }

  // 3. RESULT UI
  if (gameState === GAME_STATE.REDIRECT) {
    const testResp = testData?.[0];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 text-center border border-slate-100">
          <div className="relative inline-block mb-6">
            <div className="size-20 md:size-24 bg-amber-50 rounded-full flex items-center justify-center">
              <Trophy className="text-amber-500 size-10 md:size-12" />
            </div>
            <div className="absolute -top-1 -right-1 px-2 py-0.5 md:px-3 md:py-1 bg-purple-600 text-white rounded-full text-[10px] font-black animate-bounce">
              DONE!
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter">Test Completed</h1>
          <p className="text-sm md:text-base text-slate-500 mt-2 font-medium">Redirecting in <span className="text-purple-600 font-bold">{redirectTimer}s</span></p>

          <div className="mt-6 md:mt-8 mb-8 md:mb-10 p-6 md:p-8 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
              <p className="text-5xl md:text-6xl font-black text-purple-600">{testResp?.score || ". . ." }</p>
          </div>

          <button 
            onClick={() => navigate('/profile')}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
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