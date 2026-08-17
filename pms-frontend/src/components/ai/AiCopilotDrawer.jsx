import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Bot, Sparkles, Copy, Check, RefreshCw, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AiCopilotDrawer = ({ patientId, onApplyToRecord }) => {
  const { showToast } = useToast();
  const [rawNotes, setRawNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!rawNotes.trim()) {
      showToast('Please enter consultation notes or symptoms first.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await aiService.doctorCopilot(rawNotes, patientId);
      setResult(res);
      showToast('Clinical SOAP note draft created!', 'success');
    } catch (err) {
      showToast('Failed to generate clinical note.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.formattedClinicalNote) {
      navigator.clipboard.writeText(result.formattedClinicalNote);
      setCopied(true);
      showToast('Copied clinical note to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (result && onApplyToRecord) {
      onApplyToRecord({
        symptoms: result.symptoms || rawNotes,
        diagnosis: result.assessment || 'Under evaluation',
        treatment: result.planAndFollowUp || '',
        notes: result.formattedClinicalNote
      });
      showToast('Applied AI draft to Medical Record form!', 'success');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            Doctor AI Copilot &mdash; Clinical Note Assistant <Sparkles className="w-4 h-4 text-amber-500" />
          </h3>
          <p className="text-xs text-slate-500">
            Convert raw consultation notes into structured SOAP clinical entries.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Raw Consultation Notes / Symptoms
          </label>
          <textarea
            rows={3}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="e.g. Patient presents with severe persistent migraine for 3 days, light sensitivity, nausea. BP 130/85..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !rawNotes.trim()}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate Clinical SOAP Draft</span>
        </button>

        {result && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-700">Generated Clinical SOAP Note</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 bg-white rounded-lg border border-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                {onApplyToRecord && (
                  <button
                    onClick={handleApply}
                    className="flex items-center gap-1 text-[11px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Copy to Medical Record</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto p-3 bg-white rounded-xl border border-slate-200">
              {result.formattedClinicalNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
