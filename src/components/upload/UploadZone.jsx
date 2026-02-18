import React from 'react';

function UploadZone({ dragActive, onDrag, onDrop, onOpenModal }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 py-4">

      {/* Drop zone card */}
      <div
        className={`relative w-full max-w-xl rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer group ${
          dragActive
            ? 'border-indigo-400 bg-indigo-50/80 scale-[1.01] shadow-xl shadow-indigo-100'
            : 'border-indigo-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-lg hover:shadow-indigo-50'
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={onOpenModal}
      >
        {/* Decorative corner blobs */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-100/60 rounded-full blur-2xl pointer-events-none transition-opacity group-hover:opacity-80" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyan-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center px-8 py-10">

          {/* Animated icon stack */}
          <div className="relative mb-6">
            {/* Ripple rings */}
            <div className={`absolute inset-0 rounded-3xl bg-indigo-300/20 ${dragActive ? 'animate-ripple' : 'group-hover:animate-ripple'}`} />
            <div className={`absolute inset-0 rounded-3xl bg-indigo-200/15 ${dragActive ? 'animate-ripple' : 'group-hover:animate-ripple'}`} style={{ animationDelay: '0.4s' }} />

            {/* Main icon */}
            <div className={`relative h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-200/60 transition-transform duration-500 ${dragActive ? 'scale-110 rotate-6' : 'group-hover:scale-105 group-hover:rotate-3'}`}>
              {dragActive ? '🌊' : '📂'}
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 font-display">
            {dragActive ? 'Release to Upload!' : 'Upload Study Material'}
          </h2>
          <p className="text-slate-400 text-sm font-medium mb-6 max-w-xs leading-relaxed">
            AI transforms your notes into summaries, quizzes, and smart search — instantly.
          </p>

          {/* CTA Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
            className="relative px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-200/60 hover:shadow-indigo-300/70 hover:scale-[1.03] active:scale-95 transition-all overflow-hidden group/btn"
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Choose File Type
            </span>
          </button>

          <div className="flex items-center gap-3 mt-5 text-slate-300">
            <div className="h-px w-10 bg-slate-200" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">or drag & drop</span>
            <div className="h-px w-10 bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Supported format pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { icon: '📄', label: 'PDF', color: 'bg-rose-50 text-rose-600 border-rose-100' },
          { icon: '📝', label: 'Word / PPT', color: 'bg-blue-50 text-blue-600 border-blue-100' },
          { icon: '🖼️', label: 'Images', color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { icon: '✍️', label: 'Handwritten', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { icon: '💬', label: 'Text Notes', color: 'bg-violet-50 text-violet-600 border-violet-100' },
        ].map(({ icon, label, color }) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${color}`}
          >
            <span>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Feature stats */}
      <div className="flex items-center gap-6 md:gap-10">
        {[
          { icon: '⚡', value: 'AI-Powered', label: 'Summarization' },
          { icon: '🧠', value: 'Instant', label: 'Quiz Generation' },
          { icon: '🔍', value: 'Smart', label: 'Semantic Search' },
        ].map(({ icon, value, label }) => (
          <div key={label} className="text-center">
            <div className="text-base font-black text-indigo-600 flex items-center justify-center gap-1">
              <span className="text-sm">{icon}</span> {value}
            </div>
            <div className="text-[0.6rem] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadZone;
