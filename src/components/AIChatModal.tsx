import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { askAIChat } from '../services/aiService';
import { ChatMessage } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  initialPrompt?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your GeoPulse AI Assistant. I analyze real GIS data across Palghar, Virar, Vasai, Nalasopara, and Boisar. Ask me anything about public services or development priorities!',
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-fill prompt if passed
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const reply = await askAIChat(query);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue retrieving that answer. Please try again or ask one of the preset questions below!',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // The 4 preset questions specified by user:
  const presetQuestions = [
    'Which area needs a hospital?',
    'Which area has the best accessibility?',
    'Which area should be developed first?',
    'What is the most underserved area?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl h-[620px] max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl transition ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                GeoPulse AI Assistant
              </h3>
              <p className="text-[11px] text-slate-400">
                Grounded in Live OpenStreetMap GIS Metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Questions Strip */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
            Quick Ask:
          </span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-500 font-medium transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    isAi
                      ? 'bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      isAi ? 'text-slate-400' : 'text-emerald-200'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 text-slate-500 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>Analyzing Palghar spatial GIS indices...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask which area needs a hospital or development..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 text-xs px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
