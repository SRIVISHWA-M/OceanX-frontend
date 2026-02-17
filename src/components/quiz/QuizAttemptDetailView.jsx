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
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Error</h2>
        <p className="text-red-500 font-bold mb-10">{error || 'Attempt not found'}</p>
        <button 
          onClick={() => navigate('/quiz-history')}
          className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl"
        >
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/quiz-history')}
            className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs mb-4 hover:gap-3 transition-all"
          >
            <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to History
          </button>
          <h2 className="text-3xl font-black text-slate-900 font-display mb-1">Results Review</h2>
          <p className="text-slate-500 font-medium">{attempt.note?.title || 'Untitled Material'}</p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-3xl text-center shadow-xl shadow-slate-200">
          <span className="block text-2xl font-black">{attempt.score}/{attempt.total}</span>
          <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-60">{attempt.percentage}% Accuracy</span>
        </div>
      </div>

      {/* Questions Review */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-2 -mr-2">
        <div className="grid gap-6 pb-12">
          {(!attempt.answers || attempt.answers.length === 0) ? (
            <div className="p-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="text-4xl mb-4">📜</div>
              <h4 className="font-bold text-slate-700 mb-2">Detailed Results Not Available</h4>
              <p className="text-slate-400 text-sm">This quiz was taken before the detailed tracking feature was added. NEW quizzes will show full question-by-question results!</p>
            </div>
          ) : (
            attempt.answers.map((answer, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-[2.5rem] p-8 border-2 shadow-sm transition-all ${
                  answer.isCorrect ? 'border-emerald-50' : 'border-rose-50'
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-lg ${
                    answer.isCorrect ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'
                  }`}>
                    {answer.isCorrect ? '✓' : '✕'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                      {answer.questionText}
                    </h3>
                    
                    <div className="grid gap-2">
                      {answer.options.map((opt, optIdx) => {
                        const isUserSelection = optIdx === answer.userAnswer;
                        const isCorrectAnswer = optIdx === answer.correctAnswer;
                        
                        let variantClasses = 'bg-slate-50 border-transparent text-slate-500';
                        if (isCorrectAnswer) variantClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-4 ring-emerald-50';
                        else if (isUserSelection && !answer.isCorrect) variantClasses = 'bg-rose-50 border-rose-500 text-rose-900 ring-4 ring-rose-50';

                        return (
                          <div 
                            key={optIdx} 
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 font-semibold transition-all ${variantClasses}`}
                          >
                            <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-[0.65rem] font-black ${
                              isCorrectAnswer ? 'bg-emerald-500 text-white' : 
                              isUserSelection ? 'bg-rose-500 text-white' : 
                              'bg-slate-200 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="text-sm">{opt}</span>
                            {isUserSelection && (
                              <span className="ml-auto text-[0.6rem] font-black uppercase tracking-widest opacity-60">
                                Your Choice
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
  );
}

export default QuizAttemptDetailView;
