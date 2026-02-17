import React, { useState, useEffect, useRef } from 'react';
import noteService from '../../services/noteService';

function PreviewView({ material, onBack, onStartLearning, isCollected, onToggleCollection }) {
  const [showInsights, setShowInsights] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [viewMode, setViewMode] = useState('original'); // 'original' or 'text'
  const [isPerformingOCR, setIsPerformingOCR] = useState(false);
  const insightsRef = useRef(null);

  useEffect(() => {
    if (showInsights && insightsRef.current) {
      insightsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showInsights]);

  const handleGenerateAISummary = async () => {
    if (!material || !material.id) return;
    
    setShowInsights(true);
    setIsLoadingSummary(true);
    setSummaryError('');

    try {
      const response = await noteService.generateAISummary(material.id);
      if (response.success && response.data) {
        setAiSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error generating AI summary:', error);
      const errorMsg = error.response?.data?.message || error.message || '';
      if (errorMsg.includes('Quota reached') || errorMsg.includes('rested')) {
        setSummaryError('AI is taking a quick break (Quota reached). Please try again later!');
      } else {
        setSummaryError('Failed to generate AI summary. Please try again.');
      }
      setAiSummary('');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handlePerformOCR = async () => {
    if (!material || !material.id) return;
    
    setIsPerformingOCR(true);
    try {
      const response = await noteService.performOCR(material.id);
      if (response.success) {
        // Update local material content
        material.content = response.data.content;
        setViewMode('text');
      }
    } catch (error) {
      console.error('OCR failed:', error);
    } finally {
      setIsPerformingOCR(false);
    }
  };

  const handleDownloadText = () => {
    if (!material.content) return;
    
    const element = document.createElement("a");
    const file = new Blob([material.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${material.name.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!material) return null;

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 overflow-hidden">
      {/* Preview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6 pb-4 border-b border-slate-50">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={onBack}
            className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h2 className="text-lg md:text-2xl font-black text-slate-900 font-display tracking-tight uppercase leading-none truncate max-w-[200px] sm:max-w-md">{material.name}</h2>
            <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 md:gap-1.5 text-blue-600 font-bold text-[0.55rem] md:text-[0.65rem] uppercase bg-blue-50 px-1.5 md:px-2 py-0.5 rounded-md">
                {material.uploadedBy}
              </span>
              <span className="text-slate-300 text-[0.6rem] md:text-xs">•</span>
              <span className="text-slate-400 font-bold text-[0.55rem] md:text-[0.65rem] uppercase tracking-widest">{material.size}</span>
              {material.subject && (
                <>
                  <span className="text-slate-300 text-[0.6rem] md:text-xs">•</span>
                  <span className="text-indigo-500 font-bold text-[0.55rem] md:text-[0.65rem] uppercase bg-indigo-50 px-1.5 md:px-2 py-0.5 rounded-md tracking-wider">
                    {material.subject}
                  </span>
                </>
              )}
              {material.chapterName && (
                <span className="text-slate-400 font-bold text-[0.55rem] md:text-[0.65rem] uppercase tracking-widest">
                  / {material.chapterName}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={onToggleCollection}
            className={`flex-1 md:flex-none group relative px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[0.6rem] md:text-xs uppercase tracking-widest transition-all active:scale-95 border flex items-center justify-center gap-2 ${
              isCollected 
                ? 'bg-blue-50 text-blue-600 border-blue-100' 
                : 'bg-slate-50 text-slate-900 border-slate-100 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <span className={`text-base md:text-lg group-hover:scale-110 transition-transform ${isCollected ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}>
              {isCollected ? '📁' : '📂'}
            </span>
            {isCollected ? 'Saved' : 'Collection'}
          </button>
          <button 
            onClick={handleGenerateAISummary}
            className="flex-1 md:flex-none group relative px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-blue-600 text-white font-black text-[0.6rem] md:text-xs uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
          >
            <span className="text-base md:text-lg group-hover:rotate-12 transition-transform duration-500">✨</span>
            AI Insights
          </button>

          {material.content && (
            <button 
              onClick={handleDownloadText}
              className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-lg md:rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" 
              title="Download as Text"
            >
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          <button className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-lg md:rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-slate-50 transition-all" title="Download Original">
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-lg md:rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-slate-50 transition-all">
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8 px-1">
        <div className="flex flex-col gap-4 md:gap-6 max-w-5xl mx-auto">
          {/* Main Document Card */}
          <div className="bg-white rounded-3xl md:rounded-[3rem] border-2 border-slate-100 p-6 md:p-12 overflow-hidden relative group min-h-[400px] flex flex-col">
            {/* View Toggle for Handwritten Notes */}
            {material.type === 'handwritten' && material.content && (
              <div className="flex justify-center mb-8 gap-1 p-1.5 bg-slate-50 rounded-2xl w-fit mx-auto border border-slate-100">
                <button 
                  onClick={() => setViewMode('original')}
                  className={`px-6 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all ${viewMode === 'original' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Original Image
                </button>
                <button 
                  onClick={() => setViewMode('text')}
                  className={`px-6 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all ${viewMode === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Extracted Text
                </button>
              </div>
            )}

            {material.type === 'text' && material.content && (
              <div className="flex-1 animate-in fade-in duration-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                  <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-blue-600">Note Content</span>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed whitespace-pre-wrap font-serif italic opacity-90">
                    {material.content}
                  </p>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[0.6rem] font-bold text-slate-300 uppercase tracking-widest">End of note content</span>
                  <div className="flex gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-100"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-100"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-100"></div>
                  </div>
                </div>
              </div>
            )}

            {material.type === 'handwritten' && viewMode === 'text' && material.content && (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                  <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-emerald-500">OCR Results</span>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed whitespace-pre-wrap font-serif italic opacity-90">
                    {material.content}
                  </p>
                </div>
              </div>
            )}

            {material.type === 'handwritten' && (viewMode === 'original' || !material.content) && material.fileUrl && (
              <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-700">
                <div className="relative group/img">
                  <div className="absolute -inset-4 bg-blue-100/50 rounded-[2.5rem] blur-2xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-700"></div>
                  <img 
                    src={material.fileUrl} 
                    alt={material.name} 
                    className="relative max-w-full max-h-[600px] rounded-2xl shadow-2xl border-4 border-white object-contain"
                  />
                </div>
                <div className="mt-8 flex gap-4">
                  <a 
                    href={material.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                  >
                    View Full Image
                  </a>
                  {!material.content && (
                    <button 
                      onClick={handlePerformOCR}
                      disabled={isPerformingOCR}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isPerformingOCR ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Extracting...
                        </>
                      ) : (
                        <>
                          <span>🔍</span> Convert to Text
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {material.type === 'pdf' && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <div className="h-40 w-40 md:h-56 md:w-56 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-rose-100/30 rounded-[2.5rem] animate-pulse"></div>
                  <span className="text-6xl md:text-8xl relative">📕</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-display mb-4">PDF Document Ready</h3>
                <p className="text-slate-400 font-bold mb-10 text-center max-w-sm">This material is processed and optimized for learning. Open the full viewer to start studying.</p>
                <a 
                  href={material.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-2xl shadow-blue-100 flex items-center gap-3 group"
                >
                  Open PDF Viewer
                  <svg className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" />
                  </svg>
                </a>
              </div>
            )}

            {(!material.content && !material.fileUrl && material.type !== 'pdf') && (
              <div className="flex-1">
                <div className="space-y-6 md:space-y-8 opacity-40 select-none">
                  <div className="h-6 md:h-8 bg-slate-200 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-3 md:h-4 bg-slate-200 rounded-full w-full"></div>
                  <div className="h-3 md:h-4 bg-slate-200 rounded-full w-5/6"></div>
                  <div className="h-24 md:h-40 bg-slate-100 rounded-2xl md:rounded-[2.5rem] w-full"></div>
                  <div className="h-3 md:h-4 bg-slate-200 rounded-full w-full"></div>
                </div>
                <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 text-center w-full">
                  <span className="text-[0.5rem] md:text-[0.6rem] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-300 px-4">Preview Protected</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Hub - Controlled by showInsights */}
          {showInsights && (
            <div 
              ref={insightsRef}
              className="animate-in fade-in slide-in-from-top-10 duration-700 flex flex-col gap-4 md:gap-6"
            >
              {/* Dynamic AI Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pb-20 md:pb-0">
                {/* AI Summary Card */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl md:blur-3xl pointer-events-none"></div>
                  <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-3 md:gap-4 font-display">
                    <span className="text-2xl md:text-3xl">📝</span> Smart Summary
                  </h3>
                  
                  {isLoadingSummary ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-blue-100 text-sm font-medium">Generating AI summary...</p>
                    </div>
                  ) : summaryError ? (
                    <div className="bg-red-500/20 border border-red-300/30 rounded-xl p-4">
                      <p className="text-white text-sm font-medium">{summaryError}</p>
                      <button 
                        onClick={handleGenerateAISummary}
                        className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : aiSummary ? (
                    <p className="text-blue-50 text-sm md:text-lg leading-relaxed font-medium opacity-90">
                      {aiSummary}
                    </p>
                  ) : (
                    <p className="text-blue-50 text-sm md:text-lg leading-relaxed font-medium opacity-90">
                      Click "AI Insights" to generate an intelligent summary of this note.
                    </p>
                  )}
                  
                  {aiSummary && !isLoadingSummary && (
                    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                      <button 
                        onClick={() => navigator.clipboard.writeText(aiSummary)}
                        className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-[0.6rem] md:text-xs font-black uppercase tracking-widest backdrop-blur-md"
                      >
                        Copy Summary
                      </button>
                      <button className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 transition-all text-[0.6rem] md:text-xs font-black uppercase tracking-widest shadow-lg">
                        Save to Notes
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Quiz Hub */}
                <div className="bg-white rounded-3xl md:rounded-[2.5rem] border-2 border-slate-50 p-6 md:p-10 shadow-sm flex flex-col">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4 md:mb-6 font-display uppercase tracking-tight">Quiz Hub</h3>
                  <div className="flex-1 space-y-3 md:space-y-4">
                    {[
                      { label: 'Key Concepts', icon: '🧠', count: 4 },
                      { label: 'Practice Quiz', icon: '🎯', count: 12 },
                    ].map(opt => (
                      <button key={opt.label} className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group/opt">
                        <div className="flex items-center gap-3 md:gap-4">
                          <span className="text-lg md:text-xl group-hover/opt:scale-110 transition-transform">{opt.icon}</span>
                          <span className="font-bold text-slate-700 text-xs md:text-sm">{opt.label}</span>
                        </div>
                        <span className="text-[0.55rem] md:text-[0.65rem] font-black text-blue-500 bg-white px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg border border-blue-50 shadow-sm">
                          {opt.count}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={onStartLearning}
                    className="mt-6 md:mt-8 w-full py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-blue-600 text-white font-black text-base md:text-lg hover:bg-slate-900 transition-all duration-500 active:scale-95 shadow-xl md:shadow-2xl shadow-blue-100 flex items-center justify-center gap-3"
                  >
                    Start Learning 🚀
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewView;
