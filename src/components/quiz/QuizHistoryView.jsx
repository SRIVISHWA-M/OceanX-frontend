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
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading History...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 font-display mb-2">Quiz History</h2>
        <p className="text-slate-500 font-medium">Track your progress and review past performances</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-bold mb-6">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <div className="text-6xl mb-6">📚</div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Quizzes Yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs">Start learning from your materials to see your progress here!</p>
          <button 
            onClick={() => navigate('/search')}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-900 transition-all"
          >
            Find Materials
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar pr-2 -mr-2">
          <div className="grid gap-4 pb-8">
            {history.map((attempt) => (
              <button
                key={attempt._id}
                onClick={() => navigate(`/quiz-history/${attempt._id}`)}
                className="w-full group bg-white rounded-3xl p-6 border-2 border-slate-50 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-left flex items-center gap-6"
              >
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${
                  attempt.percentage >= 80 ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' :
                  attempt.percentage >= 50 ? 'bg-blue-50 text-blue-600 shadow-blue-100' :
                  'bg-rose-50 text-rose-600 shadow-rose-100'
                }`}>
                  {attempt.score}<span className="text-xs opacity-40 ml-0.5">/{attempt.total}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {attempt.note?.title || 'Unknown Material'}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>{new Date(attempt.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={
                      attempt.percentage >= 80 ? 'text-emerald-500' :
                      attempt.percentage >= 50 ? 'text-blue-500' :
                      'text-rose-500'
                    }>{attempt.percentage}% Accuracy</span>
                  </div>
                </div>

                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizHistoryView;
