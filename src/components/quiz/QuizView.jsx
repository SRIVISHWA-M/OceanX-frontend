import React, { useState, useEffect } from 'react';
import noteService from '../../services/noteService';

function QuizView({ material, onExit }) {
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState(null); // { generalFeedback, suggestions }
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [weakTopics, setWeakTopics] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await noteService.generateAIQuiz(material.id || material._id);
        if (response.success && response.data.quiz) {
          setQuiz(response.data.quiz);
        } else {
          throw new Error('Failed to load quiz data');
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || '';
        if (errorMsg.includes('Quota reached') || errorMsg.includes('rested')) {
          setError('AI is taking a quick break (Quota reached). Please try again in 24 hours!');
        } else {
          setError(errorMsg || 'Error generating quiz');
        }
        console.error('Quiz fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (material && (material.id || material._id)) {
      fetchQuiz();
    }
  }, [material]);

  const handleNext = async () => {
    if (currentStep < quiz.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      // Calculate final score and prepare detailed answers for history
      let totalScore = 0;
      const detailedAnswers = quiz.map((q, idx) => {
        const isCorrect = answers[idx] === q.answer;
        if (isCorrect) totalScore += 1;
        return {
          questionText: q.question,
          options: q.options,
          userAnswer: answers[idx],
          correctAnswer: q.answer,
          isCorrect: isCorrect,
          topic: q.topic || 'General Knowledge'
        };
      });

      // Compute weak topics from incorrect answers
      const incorrectTopics = [...new Set(
        detailedAnswers.filter(a => !a.isCorrect).map(a => a.topic)
      )];
      setWeakTopics(incorrectTopics);

      setScore(totalScore);
      setIsFinished(true);

      // Fetch feedback and record attempt with detailed answers
      try {
        setIsFeedbackLoading(true);
        const feedbackRes = await noteService.getQuizFeedback(
          material.id || material._id, 
          totalScore, 
          quiz.length,
          detailedAnswers
        );
        if (feedbackRes.success) {
          setFeedback(feedbackRes.data.feedback);
        } else {
          setFeedback({ generalFeedback: 'Great effort! Keep reviewing your notes.', suggestions: [] });
        }
      } catch (err) {
        console.error('Feedback fetch error:', err);
      } finally {
        setIsFeedbackLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Generating Your Quiz...</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Gemini is analyzing your notes</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Quiz Generation Failed</h2>
        <p className="text-red-500 font-bold mb-10 max-w-md">{error}</p>
        <button 
          onClick={onExit}
          className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all"
        >
          Return to Material
        </button>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((score / quiz.length) * 100);
    
    const getPerformanceData = (pct) => {
      if (pct === 100) return { label: 'Perfect Score!', emoji: '💎', color: 'text-blue-600' };
      if (pct >= 80) return { label: 'Mastery Achieved!', emoji: '🏆', color: 'text-indigo-600' };
      if (pct >= 50) return { label: 'Great Effort!', emoji: '🌟', color: 'text-slate-900' };
      if (pct >= 20) return { label: 'Keep Practicing!', emoji: '📚', color: 'text-slate-900' };
      return { label: 'Don\'t Give Up!', emoji: '💪', color: 'text-slate-900' };
    };

    const perf = getPerformanceData(accuracy);

    return (
      <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 p-6 md:p-12 overflow-y-auto no-scrollbar scroll-smooth">
        {/* Top Spacer to prevent clipping when centered */}
        <div className="h-10 md:h-20 shrink-0"></div>
        
        <div className="text-6xl md:text-8xl mb-6 md:mb-8 animate-bounce drop-shadow-2xl shrink-0">{perf.emoji}</div>
        <h2 className={`text-3xl md:text-6xl font-black ${perf.color} font-display mb-3 text-center transition-colors duration-500 shrink-0`}>
          {perf.label}
        </h2>
        <p className="text-[0.65rem] md:text-[0.8rem] font-black text-slate-400 mb-10 md:mb-16 uppercase tracking-[0.4em] md:tracking-[0.6em] text-center shrink-0">Quiz Performance Summary</p>
        
        <div className="grid grid-cols-2 gap-4 md:gap-10 w-full max-w-3xl mb-10 md:mb-16 shrink-0">
          <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 border-2 border-slate-50 shadow-2xl shadow-slate-100/50 text-center group hover:scale-[1.02] transition-transform">
            <span className="block text-4xl md:text-6xl font-black text-blue-600 mb-2">{score}<span className="text-slate-200 ml-1">/</span><span className="text-slate-200">{quiz.length}</span></span>
            <span className="text-[0.6rem] md:text-[0.75rem] font-black text-slate-400 uppercase tracking-widest">Correct Answers</span>
          </div>
          <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 border-2 border-slate-50 shadow-2xl shadow-slate-100/50 text-center group hover:scale-[1.02] transition-transform">
            <span className="block text-4xl md:text-6xl font-black text-indigo-600 mb-2">{accuracy}<span className="text-slate-200 text-3xl md:text-4xl ml-1">%</span></span>
            <span className="text-[0.6rem] md:text-[0.75rem] font-black text-slate-400 uppercase tracking-widest">Accuracy Rating</span>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="w-full max-w-3xl bg-slate-900 rounded-[3rem] p-10 md:p-14 mb-8 relative overflow-hidden group shadow-[0_20px_50px_rgba(15,23,42,0.3)] shrink-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[0.75rem] md:text-[0.85rem] font-black text-blue-400 uppercase tracking-[0.5em]">Gemini AI Insights</span>
            </div>
            {isFeedbackLoading ? (
              <div className="flex gap-3 items-center py-6">
                <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-bounce delay-300"></div>
              </div>
            ) : (
              <p className="text-slate-100 text-lg md:text-xl leading-relaxed font-semibold">
                {feedback?.generalFeedback || feedback || 'Calculating personalized study tips based on your results...'}
              </p>
            )}
          </div>
        </div>

        {/* Topic-Based Suggestions Section */}
        {!isFeedbackLoading && feedback?.suggestions && feedback.suggestions.length > 0 && (
          <div className="w-full max-w-3xl mb-12 shrink-0">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-[0.2em]">Topics to Strengthen</h3>
            </div>
            <div className="grid gap-4">
              {feedback.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-rose-50 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-md hover:border-rose-100 transition-all group"
                >
                  <div className="flex items-start gap-5">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-rose-100 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <span className="block text-[0.65rem] font-black text-rose-500 uppercase tracking-widest mb-1">Weak Topic</span>
                      <h4 className="text-base md:text-lg font-black text-slate-900 mb-2">{s.topic}</h4>
                      <p className="text-sm text-slate-500 font-semibold leading-relaxed">{s.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Topics Quick Summary (shown while loading or if no suggestions) */}
        {!isFeedbackLoading && weakTopics.length > 0 && (!feedback?.suggestions || feedback.suggestions.length === 0) && (
          <div className="w-full max-w-3xl mb-12 shrink-0">
            <div className="flex items-center gap-3 mb-5 px-2">
              <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-[0.2em]">Topics to Review</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {weakTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-5 py-2.5 bg-amber-50 border-2 border-amber-100 text-amber-800 font-bold text-sm rounded-2xl"
                >
                  📚 {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Results Review */}
        <div className="w-full max-w-3xl mb-12">
          <h3 className="text-xl font-black text-slate-800 mb-6 px-4 uppercase tracking-[0.2em]">Detailed Review</h3>
          <div className="grid gap-6">
            {quiz.map((q, idx) => {
              const isCorrect = answers[idx] === q.answer;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-[2.5rem] p-8 border-2 shadow-sm transition-all ${
                    isCorrect ? 'border-emerald-50' : 'border-rose-50'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-lg ${
                      isCorrect ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'
                    }`}>
                      {isCorrect ? '✓' : '✕'}
                    </div>
                    <div className="flex-1 text-left">
                      {q.topic && (
                        <span className={`inline-block text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg mb-3 ${
                          isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {q.topic}
                        </span>
                      )}
                      <h4 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                        {q.question}
                      </h4>
                      <div className="grid gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isUserSelection = optIdx === answers[idx];
                          const isCorrectAnswer = optIdx === q.answer;
                          
                          let variantClasses = 'bg-slate-50 border-transparent text-slate-500';
                          if (isCorrectAnswer) variantClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-4 ring-emerald-50';
                          else if (isUserSelection && !isCorrect) variantClasses = 'bg-rose-50 border-rose-500 text-rose-900 ring-4 ring-rose-50';

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
              );
            })}
          </div>
        </div>

        <button 
          onClick={onExit}
          className="w-full sm:w-auto px-16 md:px-24 py-6 md:py-8 bg-blue-600 text-white font-black text-xl md:text-2xl rounded-3xl md:rounded-[2rem] shadow-2xl shadow-blue-200 hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all mb-12 shrink-0"
        >
          Return to Material
        </button>
      </div>
    );
  }

  const currentQuestion = quiz[currentStep];
  const progress = ((currentStep + 1) / quiz.length) * 100;

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 overflow-hidden">
      {/* Quiz Header */}
      <div className="flex flex-row md:items-center justify-between mb-4 md:mb-8 gap-4">
        <div className="flex flex-col gap-1 md:gap-2">
          <span className="text-[0.55rem] md:text-[0.7rem] font-black text-blue-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">AI-Generated Mode</span>
          <h2 className="text-lg md:text-2xl font-black text-slate-900 font-display uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">Knowledge Check</h2>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-right shrink-0">
            <span className="block text-[0.5rem] md:text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">Step</span>
            <span className="text-base md:text-xl font-black text-slate-900">{currentStep + 1} <span className="text-slate-300">/ {quiz.length}</span></span>
          </div>
          <button 
            onClick={onExit}
            className="group h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 shadow-inner"
          >
            <svg className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mb-6 md:mb-10 px-1">
        <div className="w-full h-2 md:h-2.5 bg-slate-100 rounded-full relative overflow-hidden ring-4 ring-slate-50/50">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out rounded-full shadow-lg"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 items-start overflow-y-auto no-scrollbar pb-6 md:pb-4">
        {/* Question Card */}
        <div className="w-full md:flex-[1.2] bg-white rounded-3xl md:rounded-[3.5rem] border-2 border-slate-50 p-6 md:p-10 shadow-xl md:shadow-2xl shadow-slate-100/50 relative overflow-hidden flex flex-col justify-center min-h-[180px] md:min-h-[360px] shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-blue-50/30 rounded-full -mr-16 -mt-16 md:-mr-20 md:-mt-20 blur-2xl md:blur-3xl pointer-events-none"></div>
          <span className="text-[0.6rem] md:text-[0.7rem] font-black text-blue-600 bg-blue-50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl uppercase tracking-widest mb-4 md:mb-8 inline-block w-fit">
            Check {currentStep + 1}
          </span>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 md:leading-[1.3] font-display">
            {currentQuestion?.question}
          </h3>
          <div className="hidden md:flex mt-12 items-center gap-4 text-slate-300">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Select one answer</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
        </div>

        {/* Options */}
        <div className="w-full md:flex-1 flex flex-col gap-2 md:gap-2.5 shrink-0">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setAnswers(prev => ({ ...prev, [currentStep]: index }))}
              className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                answers[currentStep] === index 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100 shadow-md md:shadow-lg md:scale-[1.01]' 
                  : 'border-slate-50 bg-white hover:border-blue-200 hover:shadow-sm md:hover:shadow-md'
              }`}
            >
              <div className={`h-7 w-7 md:h-8 md:w-8 flex-shrink-0 rounded-lg md:rounded-xl flex items-center justify-center font-black text-[0.6rem] md:text-xs transition-all ${
                answers[currentStep] === index ? 'bg-blue-600 text-white rotate-6' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className={`font-bold text-xs md:text-sm leading-snug ${answers[currentStep] === index ? 'text-blue-900' : 'text-slate-600'}`}>
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-3 md:gap-4 py-4 mt-auto border-t border-slate-50 bg-white/80 backdrop-blur-sm z-10">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`flex-1 py-3.5 md:py-4 rounded-xl md:rounded-[1.5rem] font-black text-sm md:text-base transition-all flex items-center justify-center gap-2 ${
            currentStep === 0
              ? 'bg-slate-50 text-slate-200 cursor-not-allowed border border-slate-50'
              : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-blue-200 hover:bg-slate-50 active:scale-95'
          }`}
        >
          <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Prev
        </button>

        <button
          onClick={handleNext}
          disabled={answers[currentStep] === undefined}
          className={`flex-[1.5] py-3.5 md:py-4 rounded-xl md:rounded-[1.5rem] font-black text-sm md:text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
            answers[currentStep] === undefined
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-50'
              : 'bg-blue-600 text-white hover:bg-slate-900 active:scale-95 shadow-blue-100'
          }`}
        >
          {currentStep < quiz.length - 1 ? 'Next' : 'Finish'}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default QuizView;
