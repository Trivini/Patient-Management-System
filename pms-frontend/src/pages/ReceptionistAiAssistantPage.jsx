import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { appointmentService } from '../services/appointmentService';
import { useToast } from '../context/ToastContext';
import { Bot, Sparkles, Calendar, CheckCircle, Search } from 'lucide-react';

export const ReceptionistAiAssistantPage = () => {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const handleSearchSlots = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await aiService.recommendSlots({ query });
      setRecommendation(res);
    } catch (err) {
      showToast('Failed to find open slots.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-600" /> AI Natural-Language Slot Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-1">Search doctor availability by typing natural queries like "Cardiologist next Monday morning".</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSlots} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find a skin specialist next Tuesday afternoon..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Search Slots</span>
          </button>
        </form>

        {recommendation && (
          <div className="mt-6 space-y-4 text-xs">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-900 font-semibold">
              {recommendation.summaryText}
            </div>

            <div className="space-y-2">
              {recommendation.availableSlots?.map((slot, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{slot.doctorName} ({slot.specialization})</div>
                    <div className="text-slate-500">Date: {slot.date} &bull; Time: <span className="font-bold text-blue-600">{slot.time}</span></div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">Available Slot</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
