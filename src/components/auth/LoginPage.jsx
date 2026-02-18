import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`https://oceanx-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data._id, name: data.name, email: data.email }));
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
    <div className="min-h-screen w-full flex items-center justify-center bg-mesh p-4 sm:p-8 font-sans">
      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/40 border border-white/80">

        {/* ── Left: Branding panel ── */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />

          {/* Floating academic icons */}
          <div className="absolute top-[18%] right-[12%] text-6xl opacity-20 animate-float pointer-events-none">📚</div>
          <div className="absolute top-[50%] left-[8%] text-5xl opacity-15 animate-float-delay pointer-events-none">🎓</div>
          <div className="absolute bottom-[28%] right-[8%] text-5xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '0.8s' }}>📝</div>
          <div className="absolute top-[30%] left-[18%] text-4xl opacity-15 animate-float pointer-events-none" style={{ animationDelay: '1.2s' }}>✏️</div>

          {/* Ocean wave at bottom - Darkened slight blue */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-20 pointer-events-none opacity-30">
            <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="w-[200%] h-full animate-wave">
              <path d="M0,40 C100,80 200,0 300,40 C400,80 500,0 600,40 C700,80 800,20 800,40 L800,80 L0,80 Z" fill="#1e40af"/>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-12 pointer-events-none opacity-20">
            <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="w-[200%] h-full animate-wave-slow">
              <path d="M0,30 C133,60 266,0 400,30 C533,60 666,0 800,30 L800,60 L0,60 Z" fill="#1e3a8a"/>
            </svg>
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl border border-white/20 shadow-xl">
              🎓
            </div>
            <span className="text-2xl font-black text-white font-display tracking-tight">OceanX</span>
          </div>

          {/* Hero text */}
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white font-display leading-[1.05] tracking-tight mb-6">
              Knowledge<br />
              <span className="text-cyan-300">Simplified.</span>
            </h1>
            <p className="text-indigo-200 text-base font-medium leading-relaxed mb-10 max-w-xs">
              The AI-powered study platform that transforms your notes into mastery — instantly.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3">
              {[
                { icon: '⚡', text: 'AI-powered summarization' },
                { icon: '🧠', text: 'Smart quiz generation' },
                { icon: '🔍', text: 'Semantic search across notes' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center text-sm border border-white/10">
                    {icon}
                  </div>
                  <span className="text-sm font-semibold text-indigo-200">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center gap-2 text-indigo-300/50 text-[0.6rem] font-bold uppercase tracking-widest">
            <span>OceanX v4.2</span>
            <div className="h-1 w-1 rounded-full bg-indigo-400/40" />
            <span>AI-Verified</span>
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="flex-1 flex flex-col justify-center bg-white px-8 py-12 sm:px-12">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-lg shadow-md">🎓</div>
            <span className="text-xl font-black text-blue-900 font-display">OceanX</span>
          </div>

          <div className="max-w-sm w-full mx-auto">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-slate-400 font-medium mt-1.5 text-sm">
                {isLogin
                  ? 'Sign in to your intelligent study bank.'
                  : 'Start your journey to academic excellence.'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-slide-up">
                <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Johnson"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@university.edu"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  {isLogin && (
                    <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative group/pass">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-slate-300 hover:text-blue-500 transition-colors rounded-lg hover:bg-white shadow-sm ring-1 ring-transparent hover:ring-slate-100"
                  >
                    {showPassword ? (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-slate-400 font-medium">
              {isLogin ? "Don't have an account?" : 'Already a member?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
              >
                {isLogin ? 'Sign up free' : 'Sign in'}
              </button>
            </p>

            {/* Social proof */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-6">
              {[
                { value: '100+', label: 'Materials' },
                { value: '5k+', label: 'Quizzes' },
                { value: '99%', label: 'Uptime' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-base font-black text-blue-600">{value}</div>
                  <div className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
