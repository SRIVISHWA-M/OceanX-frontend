import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ searchQuery, setSearchQuery, onSearch, viewMode, setViewMode, searchCategory, setSearchCategory }) {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest"}');
  const userSeed = user.name.replace(/\s+/g, '');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'subject', label: 'Subject', icon: '📚' },
    { id: 'chapter', label: 'Chapter', icon: '📖' }
  ];

  return (
    <header className="flex h-16 md:h-24 items-center justify-between px-4 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 flex-wrap md:flex-nowrap gap-y-2 py-2 md:py-0">
      <div className="flex items-center gap-2 md:gap-4 shrink-0 order-1">
        <div className="h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-xl md:rounded-2xl ring-2 md:ring-4 ring-blue-50 transition-transform hover:scale-105 cursor-pointer shadow-sm">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`} alt="User Avatar" />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-sm md:text-base font-black text-slate-900 font-display">{user.name}</span>
          <span className="text-[0.6rem] md:text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">Premium Member</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-2 md:px-12 max-w-4xl order-3 md:order-2 w-full">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 md:pl-5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 md:h-6 md:w-6 text-blue-500 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={`Search ${searchCategory === 'all' ? 'everything' : searchCategory}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onSearch}
            onFocus={() => navigate(`/search?q=${searchQuery}&type=${searchCategory}`)}
            className="block w-full pl-10 md:pl-14 pr-3 md:pr-4 py-2 md:py-4 bg-blue-50/20 border-2 border-blue-100 rounded-full md:rounded-[2rem] text-sm md:text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 md:focus:ring-8 focus:ring-blue-100/50 focus:border-blue-400 focus:bg-white transition-all shadow-sm group-hover:border-blue-200"
          />
          <div className="absolute inset-y-0 right-0 hidden md:flex items-center pr-4">
            <kbd className="px-3 py-1.5 text-[0.7rem] font-black text-blue-500 bg-blue-50 rounded-xl shadow-sm border border-blue-100 uppercase tracking-tighter">⌘K</kbd>
          </div>
        </div>
        
        {/* Search Categories */}
        <div className="flex gap-2 mt-2 px-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSearchCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                searchCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200 hover:text-blue-500'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 text-center shrink-0 order-2 md:order-3">
        <button className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-white text-slate-500 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="hidden sm:flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-white text-slate-500 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
          <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
