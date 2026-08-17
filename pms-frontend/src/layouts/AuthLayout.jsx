import React from 'react';
import { Outlet } from 'react-router-dom';
import { Bot, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        {/* Left Hero / Brand Section */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-950 p-8 sm:p-10 text-white flex flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                M
              </div>
              <span className="text-xl font-bold tracking-tight">MediFlow PMS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4 tracking-tight">
              Next-Gen Healthcare Management & AI Copilot
            </h2>

            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed mb-6">
              Complete production-grade SaaS solution for patient records, doctor scheduling, electronic prescriptions, and intelligent medical record summaries.
            </p>

            <div className="space-y-3.5 text-xs font-medium">
              <div className="flex items-center gap-3 text-indigo-100">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Role-Based Security (Admin, Doctor, Receptionist, Patient)</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-100">
                <Bot className="w-5 h-5 text-purple-400 shrink-0" />
                <span>AI Clinical Copilot & Natural Slot Assistant</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-100">
                <HeartPulse className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Real Database Metrics & Double-Booking Safeguards</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-indigo-800/60 text-[11px] text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>AI-assisted healthcare platform &mdash; portfolio demo</span>
          </div>
        </div>

        {/* Right Form Outlet */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
