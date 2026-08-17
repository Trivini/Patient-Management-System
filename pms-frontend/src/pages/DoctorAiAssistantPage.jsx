import React from 'react';
import { AiCopilotDrawer } from '../components/ai/AiCopilotDrawer';
import { Bot, Sparkles, ShieldAlert } from 'lucide-react';

export const DoctorAiAssistantPage = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-600" /> AI Doctor Copilot Workspace
        </h1>
        <p className="text-xs text-slate-500 mt-1">Transform raw consultation notes into structured clinical SOAP notes.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Clinical Safety Protocol</span>
          <span>AI copilot provides draft clinical note formatting only. Physicians must review all generated notes prior to saving into permanent electronic health records.</span>
        </div>
      </div>

      <AiCopilotDrawer />
    </div>
  );
};
