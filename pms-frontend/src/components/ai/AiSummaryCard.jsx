import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Bot, Sparkles, RefreshCw, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AiSummaryCard = ({ patientId, patientName }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.getPatientSummary(patientId);
      setSummary(res.patientSummary);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-indigo-800/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
              AI Medical Record Summarizer <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>
            <p className="text-xs text-indigo-200">
              Summarize authorized clinical history, visits, conditions & prescriptions
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-xs font-semibold shadow-md transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          <span>{summary ? 'Regenerate Summary' : 'AI Summarize Records'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-900/50 border border-rose-700/50 rounded-xl text-rose-200 text-xs mb-4">
          {error}
        </div>
      )}

      {summary ? (
        <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-5 border border-indigo-900/40 text-xs sm:text-sm leading-relaxed text-indigo-100 whitespace-pre-wrap font-sans">
          <div className="mb-3 flex items-center justify-between pb-2 border-b border-indigo-900/60">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              AI-Generated Clinical Summary &bull; {patientName}
            </span>
            <span className="text-[10px] text-amber-300 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Doctor Review Required
            </span>
          </div>

          <div>{summary}</div>
        </div>
      ) : (
        <div className="bg-indigo-950/40 border border-dashed border-indigo-800/50 rounded-2xl p-6 text-center text-xs text-indigo-300">
          Click <span className="font-semibold text-white">"AI Summarize Records"</span> to instantly compile a structured clinical overview for {patientName || 'this patient'}.
        </div>
      )}
    </div>
  );
};
