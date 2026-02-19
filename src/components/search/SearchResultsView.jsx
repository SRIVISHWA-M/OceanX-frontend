import React from 'react';

const typeConfig = {
  pdf:         { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    label: 'PDF' },
  word:        { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100',    label: 'Word' },
  handwritten: { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   label: 'Image' },
  text:        { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Text' },
};

const typeIcons = {
  pdf: '📕',
  word: '📘',
  handwritten: '🖼️',
  text: '📝',
};

function SearchResultsView({ materials, searchQuery, onSelectMaterial, onClearSearch, isCollectionsView, onToggleCollection, collectionIds = [], onDelete, currentUserId }) {
  const displayMaterials = materials || [];

  return (
    <div className="w-full h-full flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 font-display">
            {isCollectionsView ? '📁 My Collection' : '🔍 Search Results'}
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            {isCollectionsView
              ? `${displayMaterials.length} saved item${displayMaterials.length !== 1 ? 's' : ''}`
              : `${displayMaterials.length} result${displayMaterials.length !== 1 ? 's' : ''}${searchQuery ? ` for "${searchQuery}"` : ''}`}
          </p>
        </div>
        {!isCollectionsView && (
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 text-xs font-bold transition-all active:scale-95"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto no-scrollbar -mx-1 px-1">
        {displayMaterials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="h-20 w-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl mb-5 shadow-inner">
              {isCollectionsView ? '📁' : '🔍'}
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-2">
              {isCollectionsView ? 'Collection is empty' : 'No results found'}
            </h3>
            <p className="text-sm text-slate-400 font-medium max-w-xs">
              {isCollectionsView
                ? 'Bookmark materials from search results to see them here.'
                : 'Try a different keyword or browse all materials.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 pb-20">
            {displayMaterials.map((item) => {
              const tc = typeConfig[item.type] || typeConfig.text;
              const icon = typeIcons[item.type] || '📄';
              const isInCollection = collectionIds.includes(item.id);
              const isOwner = item.uploaderId === currentUserId;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectMaterial(item)}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-200 cursor-pointer card-hover"
                >
                  {/* Icon */}
                  <div className={`h-12 w-12 flex-shrink-0 rounded-2xl ${tc.bg} ${tc.border} border flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform`}>
                    {icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>
                        {tc.label}
                      </span>
                      {item.subject && (
                        <span className="text-[0.65rem] font-semibold text-slate-500">{item.subject}</span>
                      )}
                      {item.chapterName && (
                        <span className="text-[0.65rem] text-slate-400">· {item.chapterName}</span>
                      )}
                      <span className="text-[0.65rem] text-slate-300 ml-auto">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-4 w-4 rounded-full overflow-hidden bg-indigo-100">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.uploadedBy?.replace(/\s+/g, '')}`}
                          alt=""
                          className="h-full w-full"
                        />
                      </div>
                      <span className="text-[0.6rem] font-semibold text-slate-400">{item.uploadedBy}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {onToggleCollection && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleCollection(item.id); }}
                        className={`h-8 w-8 flex items-center justify-center rounded-xl transition-all active:scale-90 ${
                          isInCollection
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-slate-50 text-slate-300 hover:bg-indigo-50 hover:text-indigo-500 border border-slate-100'
                        }`}
                        title={isInCollection ? 'Remove from collection' : 'Save to collection'}
                      >
                        <svg className="h-4 w-4" fill={isInCollection ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                      </button>
                    )}

                    {onDelete && isOwner && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 border border-slate-100 transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                        title="Delete note"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}

                    {/* Arrow */}
                    <div className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-200 group-hover:text-indigo-400 group-hover:bg-indigo-50 transition-all">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsView;
