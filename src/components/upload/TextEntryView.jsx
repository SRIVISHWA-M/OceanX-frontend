import React from 'react';

function TextEntryView({ manualText, setManualText, manualTitle, setManualTitle, onSubmit, onCancel }) {
  return (
    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onCancel}
          className="flex items-center gap-3 text-slate-400 font-bold hover:text-slate-600 transition-colors group"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-all">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          Back to Upload
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-900 font-display">Handwritten Mode</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Engine Injection</p>
        </div>
      </div>

      <div className="mb-6 relative group/title">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-10 group-focus-within/title:opacity-25 transition-opacity duration-500"></div>
        <input
          type="text"
          value={manualTitle}
          onChange={(e) => setManualTitle(e.target.value)}
          placeholder="Note Title (Required)"
          className="relative w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all shadow-sm"
        />
      </div>
      
      <div className="relative group/text">
        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-focus-within/text:opacity-40 transition-opacity duration-500"></div>
        <textarea
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Type or paste your lecture notes here..."
          className="relative w-full h-[350px] bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 text-xl font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:ring-8 focus:ring-blue-100/50 transition-all shadow-inner custom-scrollbar resize-none"
        ></textarea>
        
        <div className="absolute bottom-10 left-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[0.6rem] font-black`}>
                {['✨', 'AI', '🧪'][i-1]}
              </div>
            ))}
          </div>
          <span className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">Real-time Analysis Active</span>
        </div>

        <button 
          onClick={onSubmit}
          className="absolute bottom-8 right-8 px-10 py-5 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          Process Notes
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TextEntryView;
