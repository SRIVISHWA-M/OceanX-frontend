import React from 'react';

function SearchResultsView({ materials, searchQuery, onSelectMaterial, onClearSearch, isCollectionsView, onToggleCollection, collectionIds = [] }) {
  const displayMaterials = materials || [];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight">
            {isCollectionsView ? 'My Collection' : 'Search Results'}
          </h2>
          <p className="text-base md:text-lg font-bold text-slate-400">
            {isCollectionsView ? `You have ${displayMaterials.length} saved items` : `Found ${displayMaterials.length} items`}
          </p>
        </div>
        {!isCollectionsView && (
          <button 
            onClick={onClearSearch}
            className="flex items-center justify-center gap-2 rounded-xl md:rounded-2xl px-4 md:px-5 py-2 md:py-2.5 bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-all active:scale-95 border border-blue-100 text-sm"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Clear Search
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2 md:pr-4 -mr-2 md:-mr-4">
        <div className="grid grid-cols-1 gap-3 md:gap-4 pb-4">
          {displayMaterials.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectMaterial(item)}
              className="group flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-2xl md:rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 hover:bg-white hover:border-blue-400 hover:shadow-lg md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex h-12 w-12 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-white text-2xl md:text-3xl shadow-sm group-hover:rotate-6 transition-transform">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base md:text-xl font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</h4>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-2 font-bold text-slate-400 text-[0.6rem] md:text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                    {item.uploadedBy}
                  </span>
                  <span className="hidden sm:inline h-1 w-1 rounded-full bg-slate-200"></span>
                  {item.subject && <span className="text-slate-500 font-extrabold">{item.subject}</span>}
                  {item.chapterName && <span className="text-slate-400 font-medium ml-1">({item.chapterName})</span>}
                  <span className="hidden sm:inline h-1 w-1 rounded-full bg-slate-200 ml-1"></span>
                  <span>{item.date}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                  <span className="text-blue-500/70">{item.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onToggleCollection && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCollection(item.id);
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-90 ${
                      collectionIds.includes(item.id)
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    title={collectionIds.includes(item.id) ? "Remove from Collection" : "Add to Collection"}
                  >
                    <svg className="h-5 w-5" fill={collectionIds.includes(item.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                )}
                
                <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
          {displayMaterials.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl md:text-6xl mb-6">{isCollectionsView ? '📁' : '🔍'}</div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">
                {isCollectionsView ? 'Your collection is empty' : 'No matches found'}
              </h3>
              <p className="text-sm md:text-slate-400 font-bold mt-2">
                {isCollectionsView ? 'Save interesting materials to see them here!' : 'Try a different search term.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultsView;
