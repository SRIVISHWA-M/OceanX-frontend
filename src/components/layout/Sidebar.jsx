import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '../../services/authService';

function Sidebar({ onUploadClick, isTextMode }) {
  // const location = useLocation(); // Unused
  // const isActive = (path) => location.pathname === path; // Unused

  return (
    <aside className="group fixed bottom-0 left-0 right-0 z-50 flex h-20 w-full flex-row border-t border-slate-200 bg-white/80 p-2 backdrop-blur-lg transition-all duration-300 md:relative md:h-full md:w-20 md:flex-col md:border-r md:border-t-0 md:p-3 md:hover:w-64 shadow-lg md:shadow-sm">
      <div className="hidden items-center gap-4 px-1 md:mb-12 md:flex">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50">
          🌊
        </div>
        <span className="text-2xl font-black tracking-tight text-blue-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-display">OceanX</span>
      </div>

      <nav className="flex flex-1 flex-row items-center justify-around gap-1 md:flex-col md:justify-start md:gap-3">
        <button 
          onClick={onUploadClick}
          className="flex items-center justify-center md:justify-start gap-4 rounded-2xl bg-blue-500 p-3 text-left text-[0.95rem] font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 active:scale-95 md:w-full md:py-3 md:px-3"
        >
          <svg className="h-6 w-6 flex-shrink-0 brightness-0 invert" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:md:inline whitespace-nowrap">Upload</span>
        </button>

        {[
          { name: 'Dashboard', path: '/dashboard', icon: (
            <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          )},
          { name: 'Materials', path: '/search', icon: (
            <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )},
          { name: 'Collections', path: '/collections', icon: (
            <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          )},
          { name: 'Quiz', path: '/quiz-history', icon: (
            <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )},
        ].map((item) => (
          <NavLink
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 rounded-2xl p-3 text-center transition-all md:w-full md:flex-row md:justify-start md:gap-4 md:py-3 md:px-3 md:text-left ${
              isActive 
                ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {item.icon}
            <span className="text-[0.65rem] font-bold uppercase tracking-tighter md:text-[0.95rem] md:font-medium md:normal-case md:tracking-normal md:hidden md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:inline md:group-hover:opacity-100 whitespace-nowrap">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-slate-100 pt-6 md:block md:mt-auto">
        <button 
          onClick={() => {
            logout();
          }}
          className="flex w-full items-center justify-center md:justify-start gap-4 rounded-2xl p-3 text-left text-[0.95rem] font-bold text-red-500 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
        >
          <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="md:hidden opacity-0 transition-opacity duration-300 md:group-hover:inline md:group-hover:opacity-100 uppercase tracking-widest text-[0.7rem] whitespace-nowrap">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
