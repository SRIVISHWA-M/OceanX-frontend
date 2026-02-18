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
  const optionLetters = ['A', 'B', 'C', 'D'];
  const optionColors = [
    { idle: 'from-violet-500 to-purple-600', selected: 'from-violet-500 to-purple-600' },
    { idle: 'from-blue-500 to-cyan-500',    selected: 'from-blue-500 to-cyan-500' },
    { idle: 'from-emerald-500 to-teal-500', selected: 'from-emerald-500 to-teal-500' },
    { idle: 'from-orange-500 to-amber-500', selected: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-500 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-[0.6rem] font-black text-blue-500 uppercase tracking-[0.35em]">AI Knowledge Check</span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Question {currentStep + 1}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Step dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {quiz.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === currentStep
                    ? 'w-5 h-2.5 bg-blue-600'
                    : i < currentStep
                    ? 'w-2.5 h-2.5 bg-blue-300'
                    : 'w-2.5 h-2.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Counter pill */}
          <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            {currentStep + 1}<span className="text-slate-300"> / {quiz.length}</span>
          </span>

          {/* Exit */}
          <button
            onClick={onExit}
            className="group h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <svg className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="mb-6 shrink-0">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Body: Question + Options ── */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto no-scrollbar pb-4">

        {/* Question card */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-7 md:p-10 overflow-hidden shrink-0 shadow-2xl shadow-slate-900/20">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {currentQuestion?.topic && (
              <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                {currentQuestion.topic}
              </span>
            )}
            <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
              {currentQuestion?.question}
            </p>
            <div className="flex items-center gap-3 mt-6 text-slate-500">
              <div className="h-px flex-1 bg-slate-700" />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em]">Choose the best answer</span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-1 gap-3 shrink-0">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = answers[currentStep] === index;
            const color = optionColors[index % optionColors.length];
            return (
              <button
                key={index}
                onClick={() => setAnswers(prev => ({ ...prev, [currentStep]: index }))}
                className={`group relative flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-transparent bg-white shadow-xl shadow-slate-200/60 scale-[1.01]'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                }`}
              >
                {/* Left accent bar */}
                {isSelected && (
                  <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b ${color.selected}`} />
                )}

                {/* Letter badge */}
                <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-br ${color.selected} text-white shadow-lg`
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                }`}>
                  {optionLetters[index]}
                </div>

                {/* Option text */}
                <span className={`flex-1 font-semibold text-sm md:text-base leading-snug transition-colors duration-200 ${
                  isSelected ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-800'
                }`}>
                  {option}
                </span>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className={`h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br ${color.selected} flex items-center justify-center shadow-md`}>
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer Navigation ── */}
      <div className="flex gap-3 pt-4 mt-auto border-t border-slate-100 shrink-0">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all ${
            currentStep === 0
              ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
              : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
          }`}
        >
          <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={answers[currentStep] === undefined}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all ${
            answers[currentStep] === undefined
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : currentStep < quiz.length - 1
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-[1.01] active:scale-95'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.01] active:scale-95'
          }`}
        >
          {currentStep < quiz.length - 1 ? (
            <>
              Next Question
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Finish Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuizView;
