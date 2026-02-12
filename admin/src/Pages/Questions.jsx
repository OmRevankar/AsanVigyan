import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQuestion, fetchAllQuestions, search, sortByLatest, sortByMarksAscend, sortByMarksDesc, sortByOldest, sortByWordsAscend, sortByWordsDesc } from '../Slices/questionSlice';
import { Search, Filter, Trash, Edit3, Plus, ChevronDown, ChevronUp, Image as ImageIcon, CheckCircle2, AlertCircle, Database, Layers, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Components/Navbar';

const DeleteDialogue = ({ isOpen, setIsOpen, seletedQUid }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        const data = { uid: seletedQUid }
        dispatch(deleteQuestion(data))
            .unwrap()
            .then(() => {
                setIsOpen(false);
                window.location.reload();
            })
            .catch((e) => { console.error(e) })
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl text-center"
            >
                <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Remove Question?</h3>
                <p className="text-slate-500 font-medium mt-2 mb-8 text-sm px-2">This action is permanent and will remove the question from all future tests.</p>

                <div className="flex gap-3">
                    <button onClick={() => setIsOpen(false)} className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                    <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
                </div>
            </motion.div>
        </div>
    )
}

const Questions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const questionData = useSelector(state => state.question.questionData);

    const [isOpen, setIsOpen] = useState(false);
    const [seletedQUid, setSelectedQUid] = useState();
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const auth = useSelector((state) => state.admin.isAuthenticated);

    useEffect(() => {
        dispatch(fetchAllQuestions())
            .unwrap()
            .then(() => { })
            .catch((e) => {
                if (auth) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
            })
    }, [dispatch])

    const totalMarks = questionData.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const questionsWithImages = questionData.filter(q => q.questionImage).length;

    const handleSort = (type) => {
        switch (type) {
            case 'latest': dispatch(sortByLatest()); break;
            case 'oldest': dispatch(sortByOldest()); break;
            case 'ascend': dispatch(sortByWordsAscend()); break;
            case 'descend': dispatch(sortByWordsDesc()); break;
            case 'desc': dispatch(sortByMarksDesc()); break;
            case 'asc': dispatch(sortByMarksAscend()); break;
            default: break;
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value === "") {
            dispatch(fetchAllQuestions());
        } else {
            dispatch(search({ key: value }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* <Navbar /> */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">Question Bank</h1>
                        <p className="text-slate-500 font-medium italic text-sm md:text-base">Manage and organize your academic database</p>
                    </div>
                    <button
                        onClick={() => navigate('/q/create')}
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95"
                    >
                        <Plus size={18} /> Create New Question
                    </button>
                </div>

                {/* STATS FEATURE BOXES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className="size-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                            <Database size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Inventory</p>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800">{questionData.length} <span className="text-xs font-bold text-slate-400">Questions</span></h2>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                            <Layers size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark Weightage</p>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800">{totalMarks} <span className="text-xs font-bold text-slate-400">Total Points</span></h2>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 sm:col-span-2 lg:col-span-1">
                        <div className="size-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                            <Sparkles size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Assets</p>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800">{questionsWithImages} <span className="text-xs font-bold text-slate-400">Illustrations</span></h2>
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="h-8 w-2 bg-purple-600 rounded-full"></div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">Question Data</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:justify-end">
                        <div className="relative group flex-1 sm:max-w-xs">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search questions..."
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            />
                        </div>

                        <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
                            <Filter size={16} className="text-purple-600 mr-2" />
                            <select
                                onChange={(e) => handleSort(e.target.value)}
                                className="w-full bg-transparent text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
                            >
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="ascend">Alphabetic: Ascend</option>
                                <option value="descend">Alphabetic: Desc</option>
                                <option value="desc">Marks: High to Low</option>
                                <option value="asc">Marks: Low to High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {questionData.length > 0 ? (
                        questionData.map((qn, i) => {
                            const isExpanded = expandedId === qn.uid;
                            return (
                                <div key={qn.uid} className={`bg-white rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'ring-2 ring-purple-500 shadow-xl' : 'border-slate-100 shadow-sm hover:border-purple-200'}`}>
                                    <div
                                        className="p-4 md:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                        onClick={() => setExpandedId(isExpanded ? null : qn.uid)}
                                    >
                                        <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                                            <span className="text-slate-300 font-black text-lg md:text-xl shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-700 text-sm md:text-base line-clamp-1">{qn.description}</p>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                                    <span className="text-[9px] md:text-[10px] font-black text-purple-500 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-tighter">Value : {qn.value} M</span>
                                                    <span className="text-[9px] md:text-[10px] font-medium text-slate-400 font-mono truncate">UID: {qn.uid}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 md:gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/q/update/${qn.uid}`) }}
                                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedQUid(qn.uid); setIsOpen(true) }}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash size={18} />
                                            </button>
                                            <div className={`p-1 rounded-full ${isExpanded ? 'bg-purple-100 text-purple-600' : 'text-slate-300'}`}>
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 md:px-8 pb-6 md:pb-8 pt-2 border-t border-slate-50">
                                                    {/* Image Content */}
                                                    <div className="mb-6">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                            <ImageIcon size={12} /> Question Visual
                                                        </p>
                                                        {qn.questionImage ? (
                                                            <img src={qn.questionImage} alt="Question" className="max-h-40 md:max-h-60 w-auto rounded-2xl border-2 border-slate-100 object-contain shadow-sm" />
                                                        ) : (
                                                            <div className="h-16 md:h-20 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs md:text-sm">
                                                                No reference image attached
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Options Content */}
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                            <CheckCircle2 size={12} /> Correct Option Highlight
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {qn.options.map((opt) => {
                                                                const isCorrect = qn.correctOption === opt.id;
                                                                return (
                                                                    <div
                                                                        key={opt.id}
                                                                        className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border-2 transition-all ${isCorrect
                                                                            ? 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                                                                            : 'bg-white border-slate-100 text-slate-500'
                                                                            }`}
                                                                    >
                                                                        <span className={`size-8 rounded-xl flex items-center justify-center font-black text-xs md:text-sm shrink-0 ${isCorrect ? 'bg-green-500 text-white' : 'bg-slate-100'}`}>
                                                                            {opt.id}
                                                                        </span>
                                                                        <span className="font-bold text-sm md:text-base truncate">{opt.text}</span>
                                                                        {isCorrect && <CheckCircle2 size={18} className="ml-auto shrink-0" />}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-200 mx-auto px-4">
                            <p className="text-slate-400 font-bold">No questions found in the database.</p>
                        </div>
                    )}
                </div>
            </div>

            <DeleteDialogue isOpen={isOpen} setIsOpen={setIsOpen} seletedQUid={seletedQUid} />
        </div>
    )
}

export default Questions