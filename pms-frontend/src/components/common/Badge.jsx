import React from 'react';

export const Badge = ({ status }) => {
  if (!status) return null;

  const s = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (s === 'BOOKED' || s === 'PENDING') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (s === 'CONFIRMED' || s === 'ACTIVE') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (s === 'COMPLETED') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (s === 'CANCELLED' || s === 'INACTIVE' || s === 'NO_SHOW') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (s === 'ROLE_ADMIN') {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (s === 'ROLE_DOCTOR') {
    styles = 'bg-teal-50 text-teal-700 border-teal-200';
  } else if (s === 'ROLE_PATIENT') {
    styles = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {s.replace('ROLE_', '')}
    </span>
  );
};
