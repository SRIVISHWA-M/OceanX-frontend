import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import noteService from '../../services/noteService';

function QuizAttemptDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        setIsLoading(true);
        const response = await noteService.fetchQuizAttemptById(id);
        if (response.success) {
          setAttempt(response.data);
        }
      } catch (err) {
        console.error('Error fetching quiz attempt details:', err);
        setError('Failed to load attempt details');
      } finally {
        setIsLoading(false);
      }
    };
    loadAttempt();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl">
        <div className="relative mb-4">
          <div className="h-14 w-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">📝</div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[0.65rem] animate-pulse">Loading Detailed Report</p>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white/70 backdrop-blur-sm rounded-[2.5rem]">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 font-display">Something Went Wrong</h2>
        <p className="text-rose-500 font-bold mb-10 text-sm">{error || 'Attempt records not found'}</p>
        <button 
          onClick={() => navigate('/quiz-history')}
          className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-slate-900 shadow-xl shadow-indigo-100 transition-all hover:scale-105"
        >
          Return to History
        </button>
      </div>
    );
  }

  const weakTopics = attempt.answers 
    ? [...new Set(attempt.answers.filter(a => !a.isCorrect && a.topic).map(a => a.topic))]
    : [];

  return (
    <div className="w-full h-full flex flex-col pt-2 md:pt-4 animate-slide-up no-scrollbar">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-indigo-50/50">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/quiz-history')}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-indigo-50 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-90 shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight leading-tight">
              Review Report
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                {attempt.note?.title || 'Material Study'}
              </span>
              <span className="text-slate-300 px-1">•</span>
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">
                {new Date(attempt.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-[1.25rem] text-center shadow-xl shadow-indigo-100/50 border border-white/10">
            <span className="block text-xl font-black leading-none">{attempt.score}/{attempt.total}</span>
            <span className="text-[0.55rem] font-bold uppercase tracking-widest opacity-60 mt-1 block">Accuracy: {attempt.percentage}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Insights card */}
            <div className="bg-white rounded-[2rem] p-8 border border-indigo-50 shadow-lg shadow-indigo-100/20 relative overflow-hidden">
               <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <span className="text-lg">📊</span> Performance Insight
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-400 uppercase">Success Rate</span>
                   <div className="flex-1 mx-4 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${attempt.percentage >= 80 ? 'bg-emerald-500' : attempt.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${attempt.percentage}%` }} />
                   </div>
                   <span className="text-sm font-black text-slate-700">{attempt.percentage}%</span>
                 </div>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-l-2 border-indigo-100 pl-4 py-1">
                   {attempt.percentage >= 80 ? 'Exceptional performance! You have a solid grasp of this material.' : 
                    attempt.percentage >= 50 ? 'Good effort. A quick review of the incorrect items will bridge the gap.' : 
                    'Consider re-reading the source material and focusing on the weak topics listed below.'}
                 </p>
               </div>
            </div>

            {/* Weak topics card */}
            <div className={`rounded-[2rem] p-8 border shadow-lg shadow-indigo-100/20 relative overflow-hidden ${weakTopics.length > 0 ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <span className="text-lg">{weakTopics.length > 0 ? '🎯' : '💎'}</span> {weakTopics.length > 0 ? 'Focus Areas' : 'Perfect Coverage'}
               </h3>
               {weakTopics.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                   {weakTopics.map((topic, i) => (
                     <span key={i} className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 font-bold text-[0.65rem] rounded-xl shadow-sm uppercase tracking-wider">
                       {topic}
                     </span>
                   ))}
                 </div>
               ) : (
                 <p className="text-xs text-emerald-600 font-bold leading-relaxed italic border-l-2 border-emerald-200 pl-4 py-1">
                   You mastered all topics in this quiz! Keep up the great work.
                 </p>
               )}
            </div>
          </div>

          {/* Question Review List */}
          <div className="space-y-6">
            <h3 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              Detailed Question Review <span className="flex-1 h-px bg-slate-100"></span>
            </h3>

            {(!attempt.answers || attempt.answers.length === 0) ? (
              <div className="p-16 text-center bg-white rounded-[2.5rem] border border-indigo-50 shadow-xl shadow-indigo-100/20">
                <div className="h-20 w-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl mb-6 mx-auto opacity-50 grayscale shadow-inner">📄</div>
                <h4 className="font-black text-slate-800 mb-2">Detailed results missing</h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm mx-auto">This attempt doesn't have per-question data saved. Future quizzes will store full reviews!</p>
              </div>
            ) : (
              attempt.answers.map((answer, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white rounded-[2rem] p-6 md:p-8 border shadow-sm transition-all animate-slide-up hover:shadow-lg hover:shadow-indigo-100/30 ${
                    answer.isCorrect ? 'border-emerald-50 shadow-emerald-50/50' : 'border-rose-50 shadow-rose-50/50'
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className={`h-11 w-11 md:h-12 md:w-12 rounded-2xl flex items-center justify-center shrink-0 text-lg md:text-xl shadow-lg border-2 ${
                      answer.isCorrect ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-100' : 'bg-rose-500 text-white border-rose-400 shadow-rose-100'
                    }`}>
                      {answer.isCorrect ? '✓' : '✕'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {answer.topic && (
                        <span className={`inline-block text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg mb-3 shadow-sm border ${
                          answer.isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          Topic: {answer.topic}
                        </span>
                      )}
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 leading-relaxed tracking-tight">
                        {answer.questionText}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {answer.options.map((opt, optIdx) => {
                          const isUserSelection = optIdx === answer.userAnswer;
                          const isCorrectAnswer = optIdx === answer.correctAnswer;
                          
                          let cardStyle = 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100';
                          let badgeStyle = 'bg-slate-200 text-slate-400';

                          if (isCorrectAnswer) {
                            cardStyle = 'bg-emerald-50 border-emerald-200 text-emerald-800 ring-2 ring-emerald-50/50';
                            badgeStyle = 'bg-emerald-500 text-white';
                          } else if (isUserSelection && !answer.isCorrect) {
                            cardStyle = 'bg-rose-50 border-rose-200 text-rose-800 ring-2 ring-rose-50/50';
                            badgeStyle = 'bg-rose-500 text-white';
                          }

                          return (
                            <div 
                              key={optIdx} 
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-sm font-semibold ${cardStyle}`}
                            >
                              <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-[0.6rem] font-black shrink-0 ${badgeStyle}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className="flex-1 leading-snug">{opt}</span>
                              {isUserSelection && (
                                <span className={`text-[0.55rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${answer.isCorrect ? 'bg-emerald-200/50 text-emerald-700' : 'bg-rose-200/50 text-rose-700'}`}>
                                  You
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizAttemptDetailView;
