import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { Bot, Send, Sparkles, User, ShieldAlert, RefreshCw } from 'lucide-react';

export const PatientAiAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      text: `Hello ${user?.fullName || ''}! I'm MediFlow AI Health Assistant. I can help answer questions about clinic services, assist with booking appointments, and explain your medical records.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const prompts = [
    "How can I book an appointment?",
    "Show my upcoming appointment",
    "Explain my medical record",
    "Help me find a doctor",
    "What departments are available?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend = input) => {
    const text = textToSend.trim();
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: "I experienced a connection issue. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-600" /> AI Patient Health & Support Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-1">Ask questions regarding appointments, clinic departments, and health record explanations.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-800 flex items-center gap-2 font-medium">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>This AI assistant provides general information and administrative support. It does not diagnose conditions or replace professional medical advice.</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden h-[65vh] flex flex-col">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'USER' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}
              >
                {msg.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'USER'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`text-[10px] text-slate-400 mt-1 px-1 ${msg.sender === 'USER' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-white rounded-2xl border border-slate-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              <span>MediFlow AI is formulating a response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {prompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200/60"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
