import React from 'react';

function TextEntryView({ manualText, setManualText, manualTitle, setManualTitle, onSubmit, onCancel }) {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-scale flex flex-col h-full lg:max-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 font-bold hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95 group"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[0.7rem] uppercase tracking-widest">Back to Library</span>
        </button>
        
        <div className="text-left sm:text-right">
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">Intelligence <span className="gradient-text">Injection</span></h2>
          <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5 border-l-2 sm:border-l-0 sm:border-r-2 border-indigo-200 pl-3 sm:pl-0 sm:pr-3 py-0.5 transition-all">Direct Memory Loading Channel</p>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 min-h-0 flex flex-col gap-5 relative">
        <div className="relative shrink-0 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <input
            type="text"
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
            placeholder="Material Designation (Title)"
            className="relative w-full bg-white border border-indigo-100 rounded-2xl px-6 py-4 text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex-1 min-h-0 relative flex flex-col group">
          <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-[2rem] md:rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex-1 min-h-0 bg-white border border-indigo-100 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-inner">
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Stream your consciousness, lecture transcripts, or copied notes here... OceanX AI will handle the rest."
              className="flex-1 w-full bg-transparent p-6 md:p-10 text-lg md:text-xl font-medium text-slate-700 placeholder-slate-200 focus:outline-none transition-all custom-scrollbar resize-none font-serif italic"
            ></textarea>
            
            {/* Action Bar Footer */}
            <div className="bg-slate-50 border-t border-indigo-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['🧠', '📚', '✨'].map((emoji, i) => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[0.65rem] shadow-sm transform hover:-translate-y-1 transition-transform cursor-help" title="AI Optimizer Active">
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="text-[0.65rem] font-black text-indigo-400 uppercase tracking-widest hidden sm:inline">Engine Ready for Processing</span>
              </div>

              <button 
                onClick={onSubmit}
                className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden group/btn"
              >
                <span className="relative z-10">Compress & Save</span>
                <svg className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextEntryView;
