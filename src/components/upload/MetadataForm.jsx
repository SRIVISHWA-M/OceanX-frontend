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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[0.65rem] font-black uppercase tracking-widest mb-3">
            {noteType === 'text' ? 'Text Note' : 'File Upload'}
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-display">Add Details</h2>
          <p className="mt-2 text-slate-500 font-bold text-sm">Organize your material for better searchability.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Physics Midterm Review"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Physics"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Chapter</label>
              <input
                type="text"
                name="chapterName"
                value={formData.chapterName}
                onChange={handleChange}
                placeholder="e.g. Thermodynamics"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-xl bg-blue-600 text-white font-black shadow-lg shadow-blue-200 hover:bg-slate-900 transition-all active:scale-95"
            >
              Upload Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MetadataForm;
