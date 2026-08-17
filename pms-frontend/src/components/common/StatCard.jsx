import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', description }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {description && <div className="text-xs text-slate-400 mt-1 font-medium">{description}</div>}
      </div>

      <div className={`p-3.5 rounded-2xl border ${colorMap[color] || colorMap.blue} shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
