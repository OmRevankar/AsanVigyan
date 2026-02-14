import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion } from '../Slices/questionSlice';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Save, LayoutList, CheckCircle2, AlertCircle, Tag } from 'lucide-react';

const CreateQuestion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const auth = useSelector((state) => state.admin.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      correctOption: "1",
      category: "Kids"
    }
  });

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('questionImage', data.questionImage?.[0]);
    formData.append('value', data.value);
    formData.append('correctOption', data.correctOption);
    formData.append('category', data.category);

    const options = [
      { id: 1, text: data.option1 },
      { id: 2, text: data.option2 },
      { id: 3, text: data.option3 },
      { id: 4, text: data.option4 }
    ];
    formData.append("options", JSON.stringify(options));

    return dispatch(createQuestion(formData))
      .unwrap()
      .then(() => {
        reset();
        navigate('/q/all-questions');
      })
      .catch((e) => {
        if (auth) {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase flex items-center justify-center md:justify-start gap-3">
            <LayoutList className="text-purple-600 shrink-0" size={32} />
            Create Question
          </h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm md:text-base">Add a new challenge to your question bank.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10">
            
            {/* Description Field */}
            <div className="mb-8">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Question Description</label>
              <textarea 
                rows="3"
                placeholder="Ex: What is the capital of France?" 
                className={`w-full px-5 md:px-6 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm md:text-base ${errors.description ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-purple-400 focus:bg-white'}`}
                {...register('description', {
                  required: "Description is required",
                  minLength: { value: 5, message: "Description is too short" }
                })}
              />
              {errors.description && (
                <p className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> {errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              {/* Image Upload */}
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Attachment</label>
                <div className="relative group h-32">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    {...register('questionImage')}
                    onChange={handleImageChange}
                  />
                  <div className={`h-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${preview ? 'border-purple-200 bg-purple-50' : 'border-slate-200 bg-slate-50 group-hover:bg-slate-100'}`}>
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-3xl p-2" />
                    ) : (
                      <ImagePlus className="text-slate-300" size={24} />
                    )}
                  </div>
                </div>
              </div>

              {/* Marks Field */}
              <div className="col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Marks</label>
                <input 
                  type="number" 
                  placeholder="2" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-purple-400 focus:bg-white outline-none font-black text-xl text-slate-700 transition-all h-32 md:h-auto"
                  {...register('value', { required: "Required" })} 
                />
                {errors.value && (
                  <p className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> {errors.value.message}</p>
                )}
              </div>

              {/* Category Field */}
              <div className="col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category</label>
                <div className="relative">
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-purple-400 focus:bg-white outline-none font-bold text-slate-700 transition-all appearance-none cursor-pointer text-sm md:text-base md:h-auto"
                    {...register('category', { required: "Category is required" })}
                  >
                    <option value="10th_Semi_English">10th Semi English</option>
                    <option value="10th_Marathi">10th Marathi</option>
                    <option value="Kids">Kids</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Tag size={16} />
                  </div>
                </div>
                {errors.category && (
                  <p className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> {errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Options Grid */}
            <div className="mb-10">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Define Answer Options</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">{num}.</span>
                    <input 
                      type="text" 
                      placeholder={`Option ${num}`}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-purple-400 focus:bg-white outline-none font-bold text-slate-700 transition-all text-sm md:text-base"
                      {...register(`option${num}`, { required: `Option ${num} is required` })} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Option Selector */}
            <div className="bg-slate-900 rounded-[1.5rem] md:rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                <div className="size-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-sm md:text-base">Correct Answer</h4>
                  <p className="text-slate-400 text-[10px] md:text-xs font-medium">Which option will grant points?</p>
                </div>
              </div>
              
              <select 
                className="w-full md:w-auto bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl font-black text-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer min-w-[180px]"
                {...register('correctOption', { required: "Please select the correct answer" })}
              >
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-8">
            <button 
              type="button" 
              onClick={() => navigate('/q/all-questions')}
              className="w-full sm:w-auto px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-200 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                "Saving Question..."
              ) : (
                <><Save size={18} /> Save to Database</>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateQuestion;