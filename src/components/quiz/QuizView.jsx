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
  const [feedback, setFeedback] = useState(null);
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

      const incorrectTopics = [...new Set(
        detailedAnswers.filter(a => !a.isCorrect).map(a => a.topic)
      )];
      setWeakTopics(incorrectTopics);
      setScore(totalScore);
      setIsFinished(true);

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

  const handleTryAgain = () => {
    setCurrentStep(0);
    setAnswers({});
    setScore(0);
    setIsFinished(false);
    setFeedback(null);
    setWeakTopics([]);
  };

  const handleAnotherQuiz = async () => {
    try {
      setIsLoading(true);
      setError('');
      setIsFinished(false);
      setCurrentStep(0);
      setAnswers({});
      setScore(0);
      setFeedback(null);
      setWeakTopics([]);

      const response = await noteService.generateAIQuiz(material.id || material._id, true);
      if (response.success && response.data.quiz) {
        setQuiz(response.data.quiz);
      } else {
        throw new Error('Failed to load new quiz data');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || '';
      if (errorMsg.includes('Quota reached') || errorMsg.includes('rested')) {
        setError('AI is taking a quick break (Quota reached). Please try again in 24 hours!');
      } else {
        setError(errorMsg || 'Error generating new quiz');
      }
      console.error('Quiz fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Generating Your Quiz...</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[0.65rem] flex items-center gap-2">
          <span className="animate-pulse">🎓</span> OceanX AI is analyzing your notes
        </p>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Quiz Generation Failed</h2>
        <p className="text-red-500 font-bold mb-10 max-w-md">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAnotherQuiz}
            className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Retry Generation
          </button>
          <button
            onClick={onExit}
            className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-700 transition-all"
          >
            Return to Material
          </button>
        </div>
      </div>
    );
  }

  // ── Results state ──
  if (isFinished) {
    const accuracy = Math.round((score / quiz.length) * 100);

    const getPerformanceData = (pct) => {
      if (pct === 100) return { label: 'Perfect Score!', emoji: '💎', color: 'text-blue-600' };
      if (pct >= 80) return { label: 'Mastery Achieved!', emoji: '🏆', color: 'text-blue-700' };
      if (pct >= 50) return { label: 'Great Effort!', emoji: '🌟', color: 'text-slate-800' };
      if (pct >= 20) return { label: 'Keep Practicing!', emoji: '📚', color: 'text-slate-800' };
      return { label: "Don't Give Up!", emoji: '💪', color: 'text-slate-800' };
    };

    const perf = getPerformanceData(accuracy);

    return (
      <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 p-6 md:p-12 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="h-10 md:h-20 shrink-0"></div>

        <div className="text-6xl md:text-8xl mb-6 md:mb-8 animate-bounce drop-shadow-2xl shrink-0">{perf.emoji}</div>
        <h2 className={`text-3xl md:text-6xl font-black ${perf.color} font-display mb-3 text-center transition-colors duration-500 shrink-0`}>
          {perf.label}
        </h2>
        <p className="text-[0.65rem] md:text-[0.8rem] font-black text-slate-400 mb-10 md:mb-16 uppercase tracking-[0.4em] md:tracking-[0.6em] text-center shrink-0">Quiz Performance Summary</p>

        <div className="grid grid-cols-2 gap-4 md:gap-10 w-full max-w-3xl mb-10 md:mb-16 shrink-0">
          <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 border-2 border-blue-50 shadow-2xl shadow-blue-100/30 text-center group hover:scale-[1.02] transition-transform">
            <span className="block text-4xl md:text-6xl font-black text-blue-600 mb-2">{score}<span className="text-slate-200 ml-1">/</span><span className="text-slate-200">{quiz.length}</span></span>
            <span className="text-[0.6rem] md:text-[0.75rem] font-black text-slate-400 uppercase tracking-widest">Correct Answers</span>
          </div>
          <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 border-2 border-blue-50 shadow-2xl shadow-blue-100/30 text-center group hover:scale-[1.02] transition-transform">
            <span className="block text-4xl md:text-6xl font-black text-blue-500 mb-2">{accuracy}<span className="text-slate-200 text-3xl md:text-4xl ml-1">%</span></span>
            <span className="text-[0.6rem] md:text-[0.75rem] font-black text-slate-400 uppercase tracking-widest">Accuracy Rating</span>
          </div>
        </div>

        {/* AI Insights */}
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
                {feedback?.generalFeedback || (typeof feedback === 'string' ? feedback : 'Calculating personalized study tips based on your results...')}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 mb-12 shrink-0">
          <button
            onClick={handleTryAgain}
            className="flex-1 px-8 py-5 bg-blue-50 text-blue-600 font-black rounded-3xl border-2 border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Try Same Quiz
          </button>
          <button
             onClick={handleAnotherQuiz}
             className="flex-1 px-8 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-slate-200"
          >
            <svg className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Generate New Quiz
          </button>
        </div>

        {/* Topic-Based Suggestions */}
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
                <div key={i} className="bg-white border-2 border-rose-50 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-md hover:border-rose-100 transition-all group">
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

        {/* Weak Topics Quick Summary */}
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
                <span key={i} className="px-5 py-2.5 bg-amber-50 border-2 border-amber-100 text-amber-800 font-bold text-sm rounded-2xl">
                  📚 {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Review */}
        <div className="w-full max-w-3xl mb-12">
          <h3 className="text-xl font-black text-slate-800 mb-6 px-4 uppercase tracking-[0.2em]">Detailed Review</h3>
          <div className="grid gap-6">
            {quiz.map((q, idx) => {
              const isCorrect = answers[idx] === q.answer;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-[2.5rem] p-8 border-2 shadow-sm transition-all ${isCorrect ? 'border-emerald-50' : 'border-rose-50'}`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-lg ${isCorrect ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'}`}>
                      {isCorrect ? '✓' : '✕'}
                    </div>
                    <div className="flex-1 text-left">
                      {q.topic && (
                        <span className={`inline-block text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg mb-3 ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {q.topic}
                        </span>
                      )}
                      <h4 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">{q.question}</h4>
                      <div className="grid gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isUserSelection = optIdx === answers[idx];
                          const isCorrectAnswer = optIdx === q.answer;

                          let variantClasses = 'bg-slate-50 border-transparent text-slate-500';
                          if (isCorrectAnswer) variantClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-4 ring-emerald-50';
                          else if (isUserSelection && !isCorrect) variantClasses = 'bg-rose-50 border-rose-500 text-rose-900 ring-4 ring-rose-50';

                          return (
                            <div key={optIdx} className={`flex items-center gap-4 p-4 rounded-2xl border-2 font-semibold transition-all ${variantClasses}`}>
                              <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-[0.65rem] font-black ${isCorrectAnswer ? 'bg-emerald-500 text-white' : isUserSelection ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className="text-sm">{opt}</span>
                              {isUserSelection && (
                                <span className="ml-auto text-[0.6rem] font-black uppercase tracking-widest opacity-60">Your Choice</span>
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
          className="w-full sm:w-auto px-16 md:px-24 py-6 md:py-8 bg-slate-900 text-white font-black text-xl md:text-2xl rounded-3xl md:rounded-[2rem] shadow-2xl shadow-blue-200 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all mb-12 shrink-0"
        >
          Return to Material
        </button>
      </div>
    );
  }

  // ── Active quiz question ──
  const currentQuestion = quiz[currentStep];
  const totalQ = quiz.length;
  const answered = answers[currentStep] !== undefined;

  const tileAccents = [
    { ring: 'ring-violet-400', bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    { ring: 'ring-sky-400',    bg: 'bg-sky-500',    light: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200'    },
    { ring: 'ring-emerald-400',bg: 'bg-emerald-500',light: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200'},
    { ring: 'ring-amber-400',  bg: 'bg-amber-500',  light: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  ];

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar pr-1">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        {/* Circular progress */}
        <div className="relative h-11 w-11 shrink-0">
          <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#f1f5f9" strokeWidth="4" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke="#3b82f6" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - (currentStep + 1) / totalQ)}`}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[0.6rem] font-black text-slate-700">
            {currentStep + 1}/{totalQ}
          </span>
        </div>

        {/* Segment track */}
        <div className="flex-1 flex gap-1">
          {quiz.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < currentStep ? 'bg-blue-500' : i === currentStep ? 'bg-blue-300' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        {/* Exit */}
        <button
          onClick={onExit}
          className="group h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 shrink-0"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Question panel ── */}
      <div className="relative flex flex-col justify-center bg-slate-50 rounded-2xl px-6 py-5 mb-4 shrink-0 overflow-hidden min-h-[110px]">
        {/* Watermark number */}
        <span
          className="absolute right-3 bottom-0 font-black text-slate-100 select-none pointer-events-none"
          style={{ fontSize: '5.5rem', lineHeight: 1 }}
        >
          {String(currentStep + 1).padStart(2, '0')}
        </span>

        {currentQuestion?.topic && (
          <span className="inline-flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-widest text-blue-500 mb-2 w-fit">
            <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {currentQuestion.topic}
          </span>
        )}

        <p className="relative z-10 text-base md:text-lg font-bold text-slate-800 leading-snug pr-20">
          {currentQuestion?.question}
        </p>
      </div>

      {/* ── Responsive Answer grid ── */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0">
        {currentQuestion?.options.map((option, index) => {
          const isSelected = answers[currentStep] === index;
          const acc = tileAccents[index % tileAccents.length];
          return (
            <button
              key={index}
              onClick={() => setAnswers(prev => ({ ...prev, [currentStep]: index }))}
              className={`group relative flex flex-col justify-between p-4 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden ${
                isSelected
                  ? `${acc.light} ${acc.border} ring-2 ${acc.ring} scale-[0.98] shadow-lg`
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md active:scale-[0.97]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {/* Letter badge */}
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-200 shrink-0 ${
                  isSelected ? `${acc.bg} text-white shadow-md` : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Tick */}
                {isSelected && (
                  <div className={`h-6 w-6 rounded-full ${acc.bg} flex items-center justify-center shadow`}>
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Option text */}
              <span className={`text-sm font-semibold leading-relaxed ${
                isSelected ? acc.text : 'text-slate-600 group-hover:text-slate-800'
              }`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Bottom navigation ── */}
      <div className="flex items-center gap-3 pt-4 mt-3 border-t border-slate-100 shrink-0">
        {currentStep > 0 && (
          <button
            onClick={handlePrevious}
            className="h-11 w-11 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-90 shrink-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!answered}
          className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl font-black text-sm transition-all ${
            !answered
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : currentStep < totalQ - 1
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100 active:scale-95'
          }`}
        >
          {currentStep < totalQ - 1 ? (
            <>
              Next
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Submit Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuizView;
