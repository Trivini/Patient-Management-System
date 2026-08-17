import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="font-medium text-slate-600">
          MediFlow PMS &mdash; <span className="text-slate-400">AI-assisted healthcare management platform — for demonstration purposes.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Production Ready</span>
          <span>&bull;</span>
          <span>Role-Based Access</span>
          <span>&bull;</span>
          <span>Secure JWT</span>
        </div>
      </div>
    </footer>
  );
};
