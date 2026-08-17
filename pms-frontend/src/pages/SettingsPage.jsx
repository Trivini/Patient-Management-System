import React from 'react';
import { Settings, Bot, Database, ShieldCheck, Cpu } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" /> System Settings & Environment Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">Configure system variables, database connection modes, and LLM API endpoints.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-purple-600" /> AI Assistant Provider Configuration
          </h3>
          <p className="text-slate-500 mb-4">
            MediFlow PMS uses environment variables (`AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`) on the secure Java backend. Secrets are never exposed to the React frontend client.
          </p>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-[11px] space-y-1">
            <div><span className="text-purple-400">AI_API_KEY</span> = [Configured via Backend Environment]</div>
            <div><span className="text-purple-400">AI_MODEL</span> = gpt-4o-mini</div>
            <div><span className="text-purple-400">AI_BASE_URL</span> = https://api.openai.com/v1</div>
            <div><span className="text-emerald-400">HEURISTIC_FALLBACK</span> = ENABLED (100% operational fallback active)</div>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-600" /> Database & Persistence Mode
          </h3>
          <p className="text-slate-500 mb-2">
            Primary: MySQL (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`).
          </p>
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl font-medium">
            Status: MySQL Connector & Fallback Dialect Ready. Double-booking prevention active.
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security & JWT Authentication
          </h3>
          <p className="text-slate-500 mb-2">
            Stateless JWT filter, BCrypt password hashing (strength 10), and role-based Spring Security Method Interceptors.
          </p>
        </div>
      </div>
    </div>
  );
};
