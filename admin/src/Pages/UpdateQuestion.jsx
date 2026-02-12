import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuestion, updateQuestion } from '../Slices/questionSlice';
import { Save, RotateCcw, ImagePlus, CheckCircle2, AlertCircle, LayoutList } from 'lucide-react';
import Navbar from '../Components/Navbar';

const UpdateQuestion = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionData = useSelector(state => state.question.singleQuestion);
  const auth = useSelector(state => state.admin.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm();

  const qnImg = watch('questionImage');
  const [preview, setPreview] = useState(null);

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchQuestion({ uid }))
      .unwrap()
      .then(() => { })
      .catch((e) => {
        if (auth) {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      })
  }, [dispatch, uid]);

  // Sync Form with Fetched Data
  useEffect(() => {
    if (questionData) {
      const optMap = {};
      questionData.options?.forEach((opt) => {
        optMap[opt.id] = opt.text;
      });

      reset({
        description: questionData.description || "",
        value: questionData.value || "",
        option1: optMap[1] || "",
        option2: optMap[2] || "",
        option3: optMap[3] || "",
        option4: optMap[4] || "",
        correctOption: questionData.correctOption || ""
      });
      setPreview(questionData.questionImage);
    }
  }, [reset, questionData]);

  // Handle New Image Preview
  useEffect(() => {
    if (qnImg && qnImg.length > 0) {
      const file = qnImg[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [qnImg]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('questionImage', data.questionImage?.[0]);
    formData.append('value', data.value);
    formData.append('correctOption', data.correctOption);
    formData.append('uid', uid);

    const options = [
      { id: 1, text: data.option1 },
      { id: 2, text: data.option2 },
      { id: 3, text: data.option3 },
      { id: 4, text: data.option4 }
    ];
    formData.append("options", JSON.stringify(options));

    dispatch(updateQuestion(formData))
      .unwrap()
      .then(() => {
        navigate('/all-questions');
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <RotateCcw className="text-blue-600" size={32} />
              Update Question
            </h1>
            <p className="text-slate-500 font-medium italic mt-1">Editing UID: <span className="text-blue-600 font-mono not-italic">{uid}</span></p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/all-questions')}
            className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors mb-2"
          >
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">

            {/* Description */}
            <div className="mb-8">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Question Description</label>
              <textarea
                rows="3"
                className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-bold text-slate-700 ${errors.description ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-blue-400 focus:bg-white'}`}
                {...register('description', { required: "Description is required", minLength: { value: 5, message: "Too short" } })}
              />
              {errors.description && <p className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={14} /> {errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Image Preview & Upload */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Update Image</label>
                <div className="relative group h-44 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    {...register('questionImage')}
                  />
                  {preview ? (
                    <img src={preview} alt="Current" className="h-full w-full object-contain p-2" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <ImagePlus size={32} className="mb-2" />
                      <span className="text-xs font-bold">Upload new image</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-sm py-2 text-center text-[10px] text-white font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Change Photo
                  </div>
                </div>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Points / Value</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-400 focus:bg-white outline-none font-black text-2xl text-slate-700"
                  {...register('value', { required: "Required" })}
                />
              </div>
            </div>

            {/* Options */}
            <div className="mb-10">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Modify Options</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">{num}.</span>
                    <input
                      type="text"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-400 focus:bg-white outline-none font-bold text-slate-700"
                      {...register(`option${num}`, { required: true })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer Section */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-100">
              <div className="flex items-center gap-4">
                <CheckCircle2 size={32} />
                <div>
                  <h4 className="font-black uppercase tracking-tight">Correct Answer</h4>
                  <p className="text-blue-100 text-xs font-medium">Which option is the actual solution?</p>
                </div>
              </div>
              <select
                className="bg-blue-700 border border-blue-500 px-6 py-3 rounded-xl font-black text-white focus:ring-2 focus:ring-white outline-none cursor-pointer min-w-[180px]"
                {...register('correctOption', { required: true })}
              >
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? "Updating..." : <><Save size={18} /> Update Database</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UpdateQuestion;