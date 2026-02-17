import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Uploads', value: stats.totalUploads, icon: '📤', color: 'bg-blue-50 text-blue-600' },
    { label: 'Saved Notes', value: stats.totalSaved, icon: '🔖', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Quizzes Taken', value: stats.totalQuizzes, icon: '📝', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Avg. Accuracy', value: stats.graphData.length > 0 ? `${Math.round(stats.graphData.reduce((acc, curr) => acc + curr.score, 0) / stats.graphData.length)}%` : '0%', icon: '🎯', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto no-scrollbar pb-8 px-1">
      <div className="mb-0 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display mb-2">Performance Dashboard</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Track your academic progress with OceanX</p>
      </div>

      {/* Performance Graph AT TOP */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border-2 border-slate-50 shadow-xl md:shadow-2xl shadow-slate-100/50 flex flex-col mb-8 md:mb-12 mt-6">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 font-display">Quiz Performance</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Accuracy Trend (Line Chart)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            <span className="text-[0.65rem] font-black text-slate-500 uppercase tracking-wider">Score %</span>
          </div>
        </div>

        <div className="w-full h-[300px] md:h-[400px]">
          {stats.graphData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.graphData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '1.5rem', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    padding: '1rem 1.5rem'
                  }}
                  itemStyle={{ fontWeight: 900, color: '#2563eb' }}
                  labelStyle={{ fontWeight: 900, color: '#64748b', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={5}
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 10, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-300">
              <div className="text-6xl mb-4">📊</div>
              <p className="font-black uppercase tracking-widest text-sm text-center">Complete your first quiz to<br/>see performance data</p>
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards AT BOTTOM */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border-2 border-slate-50 shadow-xl shadow-slate-100/50 hover:scale-[1.02] transition-transform">
            <div className={`h-12 w-12 rounded-2xl ${card.color} flex items-center justify-center text-2xl mb-4`}>
              {card.icon}
            </div>
            <div className="text-2xl md:text-3xl font-black text-slate-900 mb-1">{card.value}</div>
            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardView;
