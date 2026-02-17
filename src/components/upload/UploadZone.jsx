import React from 'react';

function UploadZone({ dragActive, onDrag, onDrop, onOpenModal }) {
  return (
    <div 
      className={`relative flex w-full max-w-5xl flex-col items-center justify-center rounded-3xl md:rounded-[4rem] border-2 md:border-4 border-dashed p-6 md:p-16 transition-all duration-700 ${dragActive ? 'border-blue-400 bg-blue-50/40 scale-[1.02]' : 'border-slate-100 bg-slate-50/5 hover:border-blue-100 hover:bg-slate-100/30'}`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <div className="text-center group flex flex-col items-center">
        <div className="mb-4 md:mb-8 flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-2xl md:rounded-[3rem] bg-white text-3xl md:text-6xl shadow-xl md:shadow-2xl shadow-slate-100 transition-all group-hover:scale-110 group-hover:rotate-6 duration-500 border border-slate-50">
          📂
        </div>
        <h2 className="mb-3 md:mb-4 text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1] font-display">
          Smart <span className="text-blue-600">Note</span> Processing
        </h2>
        <p className="mx-auto mb-6 md:mb-10 max-w-xl leading-relaxed text-slate-500 text-sm md:text-lg font-semibold opacity-80">
          Transform any textbook, slide, or scribble into professional study materials in seconds.
        </p>

        <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
          <button 
            onClick={onOpenModal}
            className="group/btn relative w-full md:w-auto px-8 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-slate-900 text-white font-black text-lg md:text-xl shadow-xl md:shadow-2xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
              <span className="text-xl md:text-2xl transition-transform group-hover/btn:rotate-12">⚡</span>
              Choose Note Type
            </span>
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>
          
          <div className="flex items-center gap-4 text-slate-400">
            <div className="h-0.5 w-8 md:w-12 bg-slate-100"></div>
            <span className="text-[0.6rem] md:text-[0.8rem] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Or drop them here</span>
            <div className="h-0.5 w-8 md:w-12 bg-slate-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadZone;
