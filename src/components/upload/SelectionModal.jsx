import React from 'react';

const noteTypes = [
  {
    id: 'pdf',
    title: 'PDF',
    desc: 'Textbooks, journals & slides',
    icon: '📕',
    gradient: 'from-rose-500 to-orange-500',
    light: 'bg-rose-50',
    ring: 'ring-rose-200',
  },
  {
    id: 'word',
    title: 'Word / PPT',
    desc: 'Documents & presentations',
    icon: '📘',
    gradient: 'from-blue-500 to-indigo-500',
    light: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
  {
    id: 'handwritten',
    title: 'Handwritten',
    desc: 'Photos of notes & boards',
    icon: '🖼️',
    gradient: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50',
    ring: 'ring-emerald-200',
  },
  {
    id: 'text',
    title: 'Text Note',
    desc: 'Type or paste content directly',
    icon: '✍️',
    gradient: 'from-amber-500 to-yellow-500',
    light: 'bg-amber-50',
    ring: 'ring-amber-200',
  },
];

function SelectionModal({ isModalOpen, setIsModalOpen, onSelectNoteType }) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/50 backdrop-blur-md animate-fade-scale">
      <div
        className="absolute inset-0"
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-indigo-200/30 border border-slate-100 overflow-hidden animate-slide-up">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-display">Choose Format</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Select your material type to get started</p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-3 p-5">
          {noteTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectNoteType(type.id)}
              className={`group relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 active:scale-95 transition-all duration-200 text-left`}
            >
              {/* Icon */}
              <div className={`h-11 w-11 rounded-xl ${type.light} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {type.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{type.title}</h3>
                <p className="text-[0.65rem] text-slate-400 font-medium leading-snug mt-0.5">{type.desc}</p>
              </div>

              {/* Arrow */}
              <div className="absolute top-3 right-3 h-5 w-5 rounded-lg bg-white text-slate-200 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="px-5 pb-5">
          <p className="text-center text-[0.6rem] font-bold text-slate-300 uppercase tracking-widest">
            AI-Powered Processing · OceanX v4.2
          </p>
        </div>
      </div>
    </div>
  );
}

export default SelectionModal;
