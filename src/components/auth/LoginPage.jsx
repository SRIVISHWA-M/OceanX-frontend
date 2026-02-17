import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
        navigate('/upload');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100/50 p-4 sm:p-12 lg:p-16 font-sans relative overflow-hidden">
      <div className="flex h-full min-h-[600px] w-full max-w-[1600px] overflow-hidden rounded-3xl md:rounded-[3rem] bg-white shadow-2xl shadow-slate-200/60 border border-slate-50 relative z-10">
        {/* Left Column: Branding/Visual */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-blue-600 p-16 lg:flex overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse delay-700"></div>
        
        {/* Scattered Creative Academic Elements - Inside Blue Panel */}
        <div className="absolute top-[15%] right-[10%] text-8xl opacity-30 text-white rotate-12 pointer-events-none">📚</div>
        <div className="absolute top-[45%] left-[15%] text-7xl opacity-20 text-white -rotate-6 pointer-events-none">📝</div>
        <div className="absolute bottom-[20%] right-[15%] text-6xl opacity-25 text-white rotate-6 pointer-events-none">🎓</div>
        <div className="absolute top-[60%] right-[5%] text-7xl opacity-15 text-white rotate-12 pointer-events-none">📁</div>
        <div className="absolute bottom-[10%] left-[20%] text-5xl opacity-20 text-white -rotate-12 pointer-events-none">🖊️</div>
        
        
        <div className="z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-white text-3xl shadow-2xl ring-4 ring-white/20">
            🌊
          </div>
          <span className="text-3xl font-black text-white font-display tracking-tight">OceanX</span>
        </div>

        <div className="z-10">
          <h1 className="text-7xl font-black leading-[0.9] text-white font-display tracking-tighter">
            Knowledge <br />
            <span className="text-blue-200">Simplified.</span>
          </h1>
          <p className="mt-8 max-w-lg text-xl font-bold text-blue-100/80 leading-relaxed">
            The AI-powered command center for your academic journey. Transform notes into mastery in seconds.
          </p>
          
          <div className="mt-12 flex gap-12">
            <div>
              <span className="block text-4xl font-black text-white">100+</span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200/60">Study Materials</span>
            </div>
            <div>
              <span className="block text-4xl font-black text-white">5k+</span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200/60">Quizzes Taken</span>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center gap-4 text-blue-100/40 font-black text-[0.6rem] uppercase tracking-[0.5em]">
          <span>Interactive Learning System v4.2</span>
          <div className="h-1 w-1 rounded-full bg-blue-300/30"></div>
          <span>Cloud Verified</span>
        </div>
      </div>

      {/* Right Column: Form Side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-16 lg:w-1/2 lg:px-24 bg-slate-50/10">
        <div className="mx-auto w-full max-w-lg animate-in fade-in slide-in-from-right-8 duration-700">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-lg ring-2 ring-blue-50">🌊</div>
            <span className="text-2xl font-black text-blue-900 font-display">OceanX</span>
          </div>

          <div className="mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join OceanX'}
            </h2>
            <p className="mt-2 md:mt-4 text-base md:text-lg font-bold text-slate-400">
              {isLogin 
                ? 'Sign in to your intelligent study bank.' 
                : 'Start your journey to academic excellence.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 font-bold text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
                ⚠️ {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1 md:space-y-2">
                <label className="text-[0.6rem] md:text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Johnson"
                  className="block w-full rounded-xl md:rounded-2xl border-2 border-slate-100 bg-white p-4 md:p-5 text-base md:text-lg font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 md:focus:ring-8 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            )}

            <div className="space-y-1 md:space-y-2">
              <label className="text-[0.6rem] md:text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@university.edu"
                className="block w-full rounded-xl md:rounded-2xl border-2 border-slate-100 bg-white p-4 md:p-5 text-base md:text-lg font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 md:focus:ring-8 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[0.6rem] md:text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                {isLogin && <button type="button" className="text-[0.6rem] md:text-xs font-black text-blue-600 hover:text-blue-700">Forgot?</button>}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-xl md:rounded-2xl border-2 border-slate-100 bg-white p-4 md:p-5 text-base md:text-lg font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 md:focus:ring-8 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 md:mt-8 w-full py-4 md:py-6 bg-blue-600 text-white font-black text-lg md:text-xl rounded-xl md:rounded-2xl shadow-xl shadow-blue-100 hover:bg-slate-900 md:hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <div className="h-5 w-5 md:h-6 md:w-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Enter Field Base' : 'Create My Account'}
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>


          <p className="mt-8 md:mt-12 text-center text-xs md:text-sm font-bold text-slate-400">
            {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-600 font-black hover:underline underline-offset-4"
            >
              {isLogin ? 'Request Access' : 'Sign In Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}

export default LoginPage;
