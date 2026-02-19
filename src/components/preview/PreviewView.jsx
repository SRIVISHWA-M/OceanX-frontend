import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import noteService from '../../services/noteService';

function PreviewView({ material, onBack, onStartLearning, isCollected, onToggleCollection }) {
  const navigate = useNavigate();
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
      if (errorMsg.includes('Quota reached')) {
        setSummaryError('AI limit reached. Please try again in a moment!');
      } else {
        setSummaryError('Failed to generate summary.');
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
        material.content = response.data.content;
        setViewMode('text');
      }
    } catch (error) {
      console.error('OCR failed:', error);
    } finally {
      setIsPerformingOCR(false);
    }
  };

  const typeConfig = {
    pdf: { icon: '📕', color: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
    word: { icon: '📘', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    handwritten: { icon: '🖼️', color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    text: { icon: '📝', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  };

  const tc = typeConfig[material.type] || typeConfig.text;

  if (!material) return null;

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 animate-fade-scale">
      {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-blue-50/50">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-blue-50 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90 shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight truncate leading-tight">
              {material.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${tc.color} ${tc.border} border shadow-sm`}>
                {tc.icon} {material.type}
              </span>
              <span className="text-slate-300 px-1">•</span>
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{material.size}</span>
              {material.subject && (
                <>
                  <span className="text-slate-300 px-1">•</span>
                  <span className="text-[0.65rem] font-black text-blue-500 uppercase tracking-[0.15em] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50 shadow-sm">
                    {material.subject}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleCollection}
            className={`h-11 px-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 border flex items-center gap-2 group ${
              isCollected 
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-600 border-blue-50 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <span className={`text-lg transition-transform ${isCollected ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}>
              {isCollected ? '🌟' : '📁'}
            </span>
            {isCollected ? 'Saved' : 'Save'}
          </button>

          <button 
            onClick={handleGenerateAISummary}
            className="h-11 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="text-base animate-pulse">✨</span>
            AI Insights
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2 pb-48">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          {/* Main Content Card */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-blue-50 shadow-xl shadow-blue-50/40 p-6 md:p-10 relative overflow-hidden flex flex-col">
            
            {/* View Switching Header */}
            {material.type === 'handwritten' && material.content && (
              <div className="flex justify-center mb-10 gap-1.5 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl w-fit mx-auto shadow-inner">
                <button 
                  onClick={() => setViewMode('original')}
                  className={`px-6 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all ${viewMode === 'original' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Original Image
                </button>
                <button 
                  onClick={() => setViewMode('text')}
                  className={`px-6 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all ${viewMode === 'text' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Extracted Text
                </button>
              </div>
            )}

            {/* Content Renders */}
            <div className="flex-1 min-h-[300px]">
              {/* Text / Extracted Content */}
              {(material.type === 'text' || (material.type === 'handwritten' && viewMode === 'text')) && material.content && (
                <div className="animate-slide-up">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-1 w-10 bg-blue-500 rounded-full" />
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 italic">Document Transcript</span>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed whitespace-pre-wrap font-serif italic py-2 md:px-4 border-l-2 border-indigo-100 italic opacity-95">
                      {material.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {material.type === 'handwritten' && (viewMode === 'original' || !material.content) && material.fileUrl && (
                <div className="flex flex-col items-center justify-center animate-fade-scale">
                  <div className="relative group max-w-full">
                    <div className="absolute -inset-4 bg-indigo-100/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <img 
                      src={material.fileUrl} 
                      alt={material.name} 
                      className="relative w-full max-h-[500px] md:max-h-[600px] rounded-3xl shadow-2xl border-8 border-white object-contain"
                    />
                  </div>
                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <a 
                      href={material.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-[0.65rem] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                    >
                      View Full Size ↗
                    </a>
                    {!material.content && (
                      <button 
                        onClick={handlePerformOCR}
                        disabled={isPerformingOCR}
                        className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-[0.65rem] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPerformingOCR ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <><span>🔍</span> Extract Intelligence</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* PDF State */}
              {material.type === 'pdf' && (
                <div className="flex flex-col items-center justify-center py-12 md:py-20 animate-fade-scale">
                  <div className="group relative h-48 w-48 md:h-56 md:w-56 mb-8">
                    <div className="absolute inset-0 bg-rose-200/20 rounded-[3rem] animate-pulse" />
                    <div className="absolute inset-0 bg-rose-50 rounded-[3rem] flex items-center justify-center text-8xl md:text-9xl group-hover:scale-110 transition-transform duration-500">
                      📕
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-display mb-3">PDF Integrated</h3>
                  <p className="text-slate-400 font-bold mb-10 text-center max-w-sm text-sm">
                    This document is optimized for OceanX. Launch the advanced viewer to annotate and explore.
                  </p>
                  <a 
                    href={material.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-10 py-4.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-2xl font-black text-md hover:shadow-2xl hover:shadow-rose-100 transition-all active:scale-95 flex items-center gap-3 group"
                  >
                    Launch PDF Pro ↗
                  </a>
                </div>
              )}
            </div>

            {/* Footer decoration */}
            <div className="mt-12 pt-8 border-t border-blue-50 flex justify-between items-center opacity-40">
              <span className="text-[0.6rem] font-black text-blue-400 uppercase tracking-widest">OceanX Content Hub v4.2</span>
              <div className="flex gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                <div className="h-1.5 w-1.5 rounded-full bg-blue-200 animate-pulse" />
                <div className="h-1.5 w-1.5 rounded-full bg-blue-200" />
              </div>
            </div>
          </div>

          {/* AI Insights Expansion */}
          {showInsights && (
            <div 
              ref={insightsRef}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up"
            >
              {/* Summary Card */}
              <div className="lg:col-span-2 relative group">
                <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] blur-xl opacity-10 group-hover:opacity-15 transition-opacity" />
                <div className="relative h-full bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden border border-white/10">
                  
                  {/* Backdrop decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32" />
                  
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl md:text-2xl font-black font-display flex items-center gap-3">
                      <span className="h-10 w-10 bg-white/15 rounded-xl flex items-center justify-center text-xl">💡</span>
                      Smart Overview
                    </h3>
                    {!isLoadingSummary && aiSummary && (
                      <button 
                        onClick={() => navigator.clipboard.writeText(aiSummary)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                        title="Copy Summary"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>

                  {isLoadingSummary ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="relative">
                        <div className="h-14 w-14 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center text-lg">🧠</div>
                      </div>
                      <p className="mt-5 text-indigo-100 font-bold uppercase tracking-widest text-[0.65rem] animate-pulse">Brainstorming summary...</p>
                    </div>
                  ) : summaryError ? (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-6 text-center">
                      <p className="text-white text-sm font-bold mb-4">{summaryError}</p>
                      <button onClick={handleGenerateAISummary} className="px-6 py-2 bg-white text-indigo-900 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest transition-all">Retry Analysis</button>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-indigo-50 text-base md:text-lg leading-relaxed font-medium opacity-90 italic">
                        {aiSummary || "OceanX AI is ready to distill this document into core concepts and actionable insights. Click 'AI Insights' above to begin."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Quiz Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-600 rounded-[2.5rem] blur-xl opacity-10 group-hover:opacity-15 transition-opacity" />
                <div className="relative h-full bg-white rounded-[2.5rem] p-8 md:p-10 border border-indigo-100 shadow-xl flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:rotate-6 transition-transform">
                    🚀
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-display mb-3 uppercase tracking-tight">Mastery Mode</h3>
                  <p className="text-slate-400 font-bold text-xs mb-8 leading-relaxed px-4">
                    Ready to test your knowledge? Launch our adaptive quiz engine based on this material.
                  </p>
                  
                  <div className="w-full space-y-3 mb-8">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-[0.65rem] font-black uppercase text-slate-500 tracking-wider">
                      <span>Difficulty</span>
                      <span className="text-indigo-600">Adaptive</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-[0.65rem] font-black uppercase text-slate-500 tracking-wider">
                      <span>Target</span>
                      <span className="text-indigo-600">10 Questions</span>
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-3 mt-auto">
                    <button 
                      onClick={onStartLearning}
                      className="w-full py-4.5 rounded-[1.5rem] bg-indigo-600 text-white font-black text-md hover:bg-slate-900 shadow-xl shadow-indigo-100/50 transition-all duration-300 active:scale-95 group/btn overflow-hidden"
                    >
                      <span className="flex items-center justify-center gap-3">
                        Start Quiz
                        <svg className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>

                    <button 
                      onClick={() => navigate(`/quiz/${material.id}?refresh=true`)}
                      className="w-full py-3.5 rounded-[1.25rem] bg-white text-indigo-600 font-black text-xs uppercase tracking-widest border-2 border-indigo-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 group/refresh"
                    >
                      <svg className="h-4 w-4 group-hover/refresh:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Generate New Quiz
                    </button>
                  </div>
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
