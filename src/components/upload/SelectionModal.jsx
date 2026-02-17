import React from 'react';

function SelectionModal({ isModalOpen, setIsModalOpen, onSelectNoteType }) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-500">
      <div 
        className="absolute inset-0"
        onClick={() => setIsModalOpen(false)}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl md:rounded-[3.5rem] bg-white p-6 md:p-10 shadow-2xl animate-in zoom-in-95 fade-in duration-700 border border-slate-100 no-scrollbar">
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[0.6rem] md:text-[0.7rem] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4">Input Optimization</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-none font-display tracking-tighter">Note Type</h2>
            <p className="mt-2 md:mt-4 text-base md:text-lg font-bold text-slate-400 leading-relaxed">Select your material's source format for optimal processing.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="group h-10 w-10 md:h-14 md:w-14 flex items-center justify-center rounded-xl md:rounded-[1.5rem] bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 shadow-inner"
          >
            <svg className="h-5 w-5 md:h-8 md:w-8 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {[
            { id: 'pdf', title: 'PDF Archive', desc: 'Textbooks & journals', icon: '📕', color: 'bg-rose-50' },
            { id: 'word', title: 'Doc / Slides', desc: 'Notes & PPTX decks', icon: '📘', color: 'bg-blue-50' },
            { id: 'handwritten', title: 'Handwritten', desc: 'Board snapshots', icon: '📓', color: 'bg-emerald-50' },
            { id: 'text', title: 'Text', desc: 'Direct text entry', icon: '⌨️', color: 'bg-amber-50' }
          ].map((type) => (
            <button 
              key={type.id}
              onClick={() => onSelectNoteType(type.id)}
              className="group relative flex items-center gap-4 md:gap-6 rounded-2xl md:rounded-[2.5rem] border-2 border-slate-50 bg-white p-4 md:p-6 md:px-8 text-left transition-all hover:border-blue-500 hover:shadow-xl md:hover:shadow-2xl md:hover:-translate-y-1 active:scale-[0.98]"
            >
              <div className={`flex h-12 w-12 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-xl md:rounded-2xl ${type.color} text-2xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                {type.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter font-display">{type.title}</h3>
                <p className="mt-0.5 md:mt-1 text-xs md:text-sm font-bold text-slate-400 group-hover:text-slate-500 leading-snug">{type.desc}</p>
              </div>
              <div className="hidden sm:flex h-10 w-10 rounded-full bg-slate-50 items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-300 font-black text-[0.55rem] md:text-[0.65rem] uppercase tracking-[0.4em] md:tracking-[0.5em]">Cognitive Engine v4.2 Integrated</p>
        </div>
      </div>
    </div>
  );
}

export default SelectionModal;
