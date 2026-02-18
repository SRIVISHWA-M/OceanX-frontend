import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import noteService from '../../services/noteService';

function QuizHistoryView() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const response = await noteService.fetchQuizHistory();
        if (response.success) {
          setHistory(response.data);
        }
      } catch (err) {
        console.error('Error fetching quiz history:', err);
        setError('Failed to load quiz history');
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl">
        <div className="relative mb-4">
          <div className="h-14 w-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">📜</div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[0.65rem] animate-pulse">Retrieving Logs</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col pt-2 md:pt-4 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight">
            Quiz <span className="gradient-text">History</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[0.65rem] mt-1 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-indigo-200"></span>
            Your Journey to Mastery
          </p>
        </div>
        
        {history.length > 0 && (
          <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100/50 flex items-center gap-2">
            <span className="text-[0.65rem] font-bold text-indigo-600 uppercase tracking-widest">
              {history.length} Attempts Recorded
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-bold mb-6 flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/70 backdrop-blur-sm rounded-[2.5rem] border border-indigo-50 shadow-xl shadow-indigo-100/20">
          <div className="h-24 w-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-5xl mb-6 shadow-inner grayscale opacity-50">📚</div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Quizzes Logged</h3>
          <p className="text-slate-500 font-medium mb-10 max-w-xs leading-relaxed">Choose a material and start a quiz to track your progress here!</p>
          <button 
            onClick={() => navigate('/search')}
            className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 hover:scale-[1.03] active:scale-95"
          >
            Explore Materials
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2 pb-10">
          <div className="grid gap-4 max-w-5xl mx-auto">
            {history.map((attempt, idx) => {
              const scoreColor = 
                attempt.percentage >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50' :
                attempt.percentage >= 50 ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50' :
                'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-50';
              
              const statusColor = 
                attempt.percentage >= 80 ? 'text-emerald-500' :
                attempt.percentage >= 50 ? 'text-amber-500' :
                'text-rose-500';

              return (
                <button
                  key={attempt._id}
                  onClick={() => navigate(`/quiz-history/${attempt._id}`)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className="w-full group bg-white rounded-3xl p-5 md:p-6 border border-indigo-50 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 hover:border-indigo-200 transition-all text-left flex items-center gap-5 md:gap-7 animate-slide-up card-hover"
                >
                  {/* Score circle */}
                  <div className={`h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-2xl flex flex-col items-center justify-center border transition-transform duration-500 group-hover:scale-105 ${scoreColor}`}>
                    <span className="text-xl md:text-2xl font-black leading-none">{attempt.score}</span>
                    <span className="text-[0.65rem] font-bold opacity-60 uppercase mt-0.5">/{attempt.total}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors tracking-tight">
                      {attempt.note?.title || 'Processed Material'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🗓️</span>
                        <span className="text-[0.65rem] font-bold text-slate-400">
                          {new Date(attempt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🎯</span>
                        <span className={`text-[0.65rem] font-black uppercase tracking-wider ${statusColor}`}>
                          {attempt.percentage}% Accuracy
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow action */}
                  <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm active:scale-90">
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizHistoryView;
