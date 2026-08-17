import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 h-28 flex flex-col justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};
