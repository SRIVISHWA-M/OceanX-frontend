import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ searchQuery, setSearchQuery, onSearch, searchCategory, setSearchCategory }) {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest"}');
  const userSeed = user.name.replace(/\s+/g, '');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'subject', label: 'Subject' },
    { id: 'chapter', label: 'Chapter' },
  ];

  return (
    <header className="flex h-16 md:h-20 items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-indigo-50/80 gap-3">
      {/* Search bar */}
      <div className="flex-1 flex flex-col gap-1.5 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={`Search ${searchCategory === 'all' ? 'notes, subjects, chapters...' : searchCategory + '...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onSearch}
            onFocus={() => navigate(`/search?q=${searchQuery}&type=${searchCategory}`)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-indigo-100 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition-all"
          />
        </div>
        {/* Category pills */}
        <div className="hidden md:flex items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSearchCategory(cat.id)}
              className={`px-3 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-widest transition-all ${
                searchCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification bell */}
        <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all border border-slate-100">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <div className="h-9 w-9 rounded-xl overflow-hidden ring-2 ring-indigo-100 shadow-sm cursor-pointer hover:ring-indigo-300 transition-all">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`} alt="Avatar" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold text-slate-800 leading-tight">{user.name}</span>
            <span className="text-[0.6rem] font-semibold text-indigo-400 uppercase tracking-widest">Premium</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
