import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { Bot, Send, User, Sparkles, X, ShieldAlert, RefreshCw } from 'lucide-react';

export const AiChatModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const getSuggestedPrompts = () => {
    if (user?.role === 'ROLE_DOCTOR') {
      return [
        "Summarize this patient's history",
        "Create a draft clinical note from consultation notes",
        "Show today's appointments",
        "Help me review recent records."
      ];
    }
    return [
      "How can I book an appointment?",
      "Show my upcoming appointment",
      "Explain my medical record",
      "Help me find a doctor",
      "What departments are available?"
    ];
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'AI',
          text: `Hello ${user?.fullName || ''}! I'm MediFlow AI Assistant. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (promptToSend = input) => {
    const text = promptToSend.trim();
    if (!text || loading) return;

    const userMsg = {
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(text, conversationId);
      if (res.conversationId) setConversationId(res.conversationId);

      const aiMsg = {
        sender: 'AI',
        text: res.response,
        disclaimer: res.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: "I'm sorry, I encountered a temporary connection issue. Please try asking again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                MediFlow AI Assistant <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-blue-100">Live PMS Assistant & Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Header Banner */}
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-[11px] text-amber-800 flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>General assistance only. Does not provide medical diagnoses or replace doctor care.</span>
        </div>

        {/* Message History Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'USER'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                <div
                  className={`text-[10px] text-slate-400 mt-1 px-1 ${
                    msg.sender === 'USER' ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-white rounded-2xl border border-slate-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>MediFlow AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {getSuggestedPrompts().map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200/60"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question or request..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-md shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
