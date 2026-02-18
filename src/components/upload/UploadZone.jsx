import React from 'react';

function UploadZone({ dragActive, onDrag, onDrop, onOpenModal }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
      {/* Drop zone */}
      <div
        className={`relative w-full max-w-2xl rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer group ${
          dragActive
            ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]'
            : 'border-indigo-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={onOpenModal}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center p-10 md:p-16">
          {/* Icon */}
          <div className={`mb-6 relative transition-transform duration-500 ${dragActive ? 'scale-110' : 'group-hover:scale-105'}`}>
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-200">
              📂
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-3xl bg-indigo-400/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 font-display">
            {dragActive ? 'Drop it here!' : 'Upload Study Material'}
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium mb-8 max-w-sm leading-relaxed">
            Transform PDFs, Word docs, images, or handwritten notes into smart study materials with AI.
          </p>

          {/* CTA */}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.03] active:scale-95 transition-all"
          >
            Choose File Type
          </button>

          <div className="flex items-center gap-3 mt-6 text-slate-300">
            <div className="h-px w-12 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">or drag & drop</span>
            <div className="h-px w-12 bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        {[
          { icon: '📄', label: 'PDF' },
          { icon: '📝', label: 'Word / PPT' },
          { icon: '🖼️', label: 'Images' },
          { icon: '✍️', label: 'Handwritten' },
          { icon: '💬', label: 'Text Notes' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-indigo-50 text-slate-500 text-xs font-semibold shadow-sm"
          >
            <span>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-8 mt-8">
        {[
          { value: 'AI-Powered', label: 'Summarization' },
          { value: 'Instant', label: 'Quiz Generation' },
          { value: 'Smart', label: 'Search' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-sm font-black text-indigo-600">{value}</div>
            <div className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadZone;
