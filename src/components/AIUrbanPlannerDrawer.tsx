import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Loader2,
  ListOrdered,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AreaInfo, ChatMessage } from '../types';
import { askAIChat, fetchAreaAnalysis } from '../services/aiService';

interface AIUrbanPlannerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  area: AreaInfo;
  darkMode: boolean;
  isDossierOpen?: boolean;
}

export const AIUrbanPlannerDrawer: React.FC<AIUrbanPlannerDrawerProps> = ({
  isOpen,
  onClose,
  area,
  darkMode,
  isDossierOpen = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AI Urban Planner for ${area.name}. Grounded in live OpenStreetMap GIS spatial analysis, I can evaluate municipal deficits, simulate facility impacts, or guide capital expenditure planning.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'planner' | 'chat'>('planner');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Update initial message when area changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${area.id}`,
        sender: 'ai',
        text: `Analysis updated for ${area.name} (Accessibility: ${area.accessibilityScore}/100, ${area.categoryLabel} Coverage). What would you like to investigate?`,
        timestamp: 'Just now',
      },
    ]);
  }, [area.id]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
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
        text: 'Sorry, I encountered an issue retrieving that answer. Please try asking again!',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    `What should ${area.name} improve?`,
    'What is missing in Palghar?',
    'Where should a new hospital be built?',
    'Which area has highest growth potential?',
    'What are the future risks?',
  ];

  return (
    <div className={`fixed inset-y-0 right-0 z-[1300] w-full ${
      isDossierOpen ? 'max-w-[360px]' : 'max-w-md'
    } bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 transition-all duration-300 animate-in slide-in-from-right`}>
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base tracking-tight">AI Urban Planner</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Palghar District Smart City Advisory
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

      {/* Side Panel Tabs: Planner Dossier vs Live Chat */}
      <div className="flex items-center p-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex-1 py-1.5 rounded-xl text-center transition cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Planning Dossier ({area.name})
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 rounded-xl text-center transition cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Interactive Chat Assistant
        </button>
      </div>

      {/* Tab 1: AI Planner Dossier */}
      {activeTab === 'planner' ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Section 1: AI Recommendations */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-purple-950/20 dark:to-slate-900 border border-purple-500/25 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-purple-500" />
              <span>AI Recommendations for {area.name}</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {area.recommendation}
            </p>
            {area.simulatedImpact && (
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-purple-500/20">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>{area.simulatedImpact}</span>
              </div>
            )}
          </div>

          {/* Section 2: Priority Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <ListOrdered className="w-3.5 h-3.5 text-purple-500" />
              <span>Priority Actions</span>
            </div>
            <div className="space-y-2">
              {(area.priorityActions || [
                `Deploy primary municipal health facility within 2 km of ${area.name}`,
                `Construct pedestrian skywalk to disperse railway station commuters`,
                `Establish electric feeder transit connecting residential sectors`,
              ]).map((action, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Future Development Suggestions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Future Development Suggestions</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {area.futureSuggestions ||
                'Implement Transit-Oriented Development (TOD) zoning with higher Floor Space Index (FSI) along arterial transit corridors to self-fund municipal public infrastructure expansion.'}
            </p>
          </div>

          {/* Switch to Chat CTA */}
          <button
            onClick={() => setActiveTab('chat')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Ask AI Questions about {area.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Tab 2: Interactive Chat */
        <div className="flex-1 flex flex-col overflow-hidden text-xs">
          {/* Quick Preset Chips */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Quick:
            </span>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-500/50 hover:text-purple-500 font-medium transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      isAi
                        ? 'bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                        : 'bg-purple-600 text-white shadow-sm'
                    }`}
                  >
                    {m.text}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isAi ? 'text-slate-400' : 'text-purple-200'
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
                <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 text-slate-500 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
                  <span>AI Urban Planner analyzing GIS state...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI Urban Planner..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
