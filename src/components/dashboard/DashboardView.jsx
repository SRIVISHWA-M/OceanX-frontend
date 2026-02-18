import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import noteService from '../../services/noteService';

function DashboardView() {
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalSaved: 0,
    totalQuizzes: 0,
    graphData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await noteService.fetchUserStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🎓</div>
        </div>
      </div>
    );
  }

  const avgAccuracy = stats.graphData.length > 0 
    ? Math.round(stats.graphData.reduce((acc, curr) => acc + curr.score, 0) / stats.graphData.length)
    : 0;

  const statCards = [
    { label: 'Total Materials', value: stats.totalUploads, icon: '📚', color: 'from-blue-600 to-blue-400', bg: 'bg-blue-50/50', border: 'border-blue-100/50' },
    { label: 'Saved Items', value: stats.totalSaved, icon: '🔖', color: 'from-blue-500 to-cyan-500', bg: 'bg-indigo-50/50', border: 'border-blue-100/50' },
    { label: 'Quizzes Taken', value: stats.totalQuizzes, icon: '🎓', color: 'from-blue-700 to-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-100/50' },
    { label: 'Avg. Accuracy', value: `${avgAccuracy}%`, icon: '🎯', color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
  ];

  return (
    <div className="w-full h-full flex flex-col pt-2 md:pt-4 animate-slide-up overflow-y-auto no-scrollbar scroll-smooth">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight">
            Academic <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[0.65rem] mt-1 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-indigo-200"></span>
            Real-time Performance Metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100/50 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[0.65rem] font-bold text-blue-600 uppercase tracking-wider">Live Tracking</span>
          </div>
        </div>
      </div>

      {/* Grid: Main Chart & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Performance Graph */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-indigo-100/50 shadow-xl shadow-indigo-100/20 relative overflow-hidden group">
          {/* Subtle background flair */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-100/50 transition-colors duration-700" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-black text-slate-800 font-display">Quiz Performance Trend</h3>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Average accuracy over your last 10 attempts</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
                <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[280px] md:h-[320px] relative z-10">
            {stats.graphData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{ 
                      borderRadius: '1rem', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)',
                      padding: '0.75rem 1rem'
                    }}
                    itemStyle={{ fontWeight: 800, color: '#4f46e5', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 700, color: '#94a3b8', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563eb" 
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    dot={{ r: 4, fill: '#fff', stroke: '#2563eb', strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-4 grayscale opacity-50">📉</div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">No Data Available</h4>
                <p className="text-[0.65rem] text-slate-300 font-bold max-w-xs">Complete a few quizzes to see your learning curve visualization here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-8 border border-white/10 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden flex flex-col">
          {/* Animated waves at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full animate-wave">
              <path d="M0,30 C100,60 200,0 300,30 C400,60 500,0 600,30 L600,60 L0,60 Z" fill="white"/>
            </svg>
          </div>

          <div className="relative z-10 flex-1">
            <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-blue-200">Scholar Rank</span>
            <h3 className="text-2xl font-black font-display mt-2 mb-6">Expert Learner</h3>
            
            <div className="relative h-24 w-24 mx-auto mb-6">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 stroke-dasharray-[75,100] transition-all duration-1000"
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🏆</div>
            </div>
          </div>

          <button className="relative z-10 w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all border border-white/10">
            View Achievements
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <h3 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3 italic">
        Activity Metrics <span className="flex-1 h-px bg-slate-100"></span>
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            className={`group relative ${card.bg} rounded-3xl p-5 md:p-6 border ${card.border} hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300 card-hover overflow-hidden`}
          >
            {/* Hover Icon Decoration */}
            <div className="absolute -top-4 -right-4 h-16 w-16 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors" />
            
            <div className={`h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl md:text-2xl mb-4 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            
            <div className="relative z-10">
              <div className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">
                {card.value}
              </div>
              <div className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardView;
