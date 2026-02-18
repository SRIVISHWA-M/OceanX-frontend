import React, { useState, useEffect } from 'react';

function MetadataForm({ file, noteType, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    chapterName: '',
    subject: ''
  });

  useEffect(() => {
    if (file) {
      // Default title to filename without extension
      const name = file.name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, title: name }));
    }
  }, [file]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-fade-scale">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg rounded-[2rem] bg-white p-8 md:p-10 shadow-3xl animate-slide-up border border-indigo-50">
        {/* Top decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[0.6rem] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
              {noteType === 'text' ? '📝 New Text Note' : '📤 File Processing'}
            </span>
            {file && (
              <span className="text-[0.65rem] font-bold text-slate-400 truncate max-w-[150px]">
                {file.name}
              </span>
            )}
          </div>
          <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight leading-tight">Details & <span className="gradient-text">Context</span></h2>
          <p className="mt-2 text-slate-500 font-medium text-sm leading-relaxed">Add metadata to help our AI organize and index your learning materials precisely.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Title <span className="text-indigo-500">*</span></label>
            <div className="relative group">
               <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Physics Midterm Review"
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-bold text-slate-800 placeholder-slate-300"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Physics"
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-bold text-slate-800 placeholder-slate-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Chapter</label>
              <input
                type="text"
                name="chapterName"
                value={formData.chapterName}
                onChange={handleChange}
                placeholder="e.g. Thermodynamics"
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-bold text-slate-800 placeholder-slate-300"
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-black text-slate-400 text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Finalize & Upload</span>
              <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-300 font-black text-[0.55rem] uppercase tracking-[0.4em]">Integrated Intelligence Cycle v4.2</p>
        </div>
      </div>
    </div>
  );
}

export default MetadataForm;
