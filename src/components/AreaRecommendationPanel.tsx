import React, { useState } from 'react';
import { AreaInfo } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  X,
  Bot,
  Loader2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { fetchAreaAnalysis } from '../services/aiService';

interface AreaRecommendationPanelProps {
  area: AreaInfo;
  onClose?: () => void;
  onAskAI?: (prompt: string) => void;
  darkMode: boolean;
}

export const AreaRecommendationPanel: React.FC<AreaRecommendationPanelProps> = ({
  area,
  onClose,
  onAskAI,
  darkMode,
}) => {
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const data = await fetchAreaAnalysis({
        areaName: area.name,
        score: area.accessibilityScore,
        breakdown: area.breakdown,
        counts: area.counts,
      });
      setAiData(data);
    } catch (e) {
      console.warn('AI analysis fallback', e);
    } finally {
      setLoading(false);
    }
  };

  const displayStrengths = aiData?.strengths || area.strengths;
  const displayWeaknesses = aiData?.weaknesses || area.weaknesses;
  const displayRecommendation = aiData?.recommendation || area.recommendation;
  const displaySimulatedImpact = aiData?.simulatedImpact || area.simulatedImpact;
  const displayScore = aiData?.accessibilityScore || area.accessibilityScore;

  // Category Colors
  const scoreColor =
    displayScore >= 80
      ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30' // Green: Excellent
      : displayScore >= 65
      ? 'text-[#84cc16] bg-[#84cc16]/10 border-[#84cc16]/30' // Light Green: Good
      : displayScore >= 50
      ? 'text-[#eab308] bg-[#eab308]/10 border-[#eab308]/30' // Yellow: Moderate
      : displayScore >= 35
      ? 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/30' // Orange: Poor
      : 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30'; // Red: Critical

  return (
    <div
      className={`rounded-2xl border p-5 shadow-2xl backdrop-blur-xl transition space-y-4 max-h-[85vh] overflow-y-auto ${
        darkMode
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {area.taluka} Taluka
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs font-medium text-slate-400">Pop: {area.population}</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight mt-0.5">{area.name}</h3>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Accessibility Score Pill & Formula Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Accessibility Score
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-base font-extrabold font-mono px-3 py-0.5 rounded-full border ${scoreColor}`}>
              {displayScore}/100
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({area.categoryLabel})
            </span>
          </div>
        </div>

        {/* 40-30-20-10 Formula Sub-Scores */}
        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-center">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Health (40%)</div>
            <div className="font-bold text-xs font-mono text-rose-500">{area.breakdown.healthcare}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Edu (30%)</div>
            <div className="font-bold text-xs font-mono text-blue-500">{area.breakdown.education}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Transit (20%)</div>
            <div className="font-bold text-xs font-mono text-amber-500">{area.breakdown.transportation}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Govt (10%)</div>
            <div className="font-bold text-xs font-mono text-cyan-500">{area.breakdown.government}</div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Strengths</span>
        </div>
        <ul className="space-y-1 pl-1">
          {displayStrengths.map((str: string, i: number) => (
            <li
              key={i}
              className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed"
            >
              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Weaknesses</span>
        </div>
        <ul className="space-y-1 pl-1">
          {displayWeaknesses.map((wkn: string, i: number) => (
            <li
              key={i}
              className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed"
            >
              <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
              <span>{wkn}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Recommendation Grounded in Data */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI Smart City Recommendation</span>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            <span>Re-evaluate</span>
          </button>
        </div>
        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          {displayRecommendation}
        </p>
        {displaySimulatedImpact && (
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-emerald-500/20">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span>{displaySimulatedImpact}</span>
          </div>
        )}
      </div>

      {/* Action: Ask AI Assistant */}
      {onAskAI && (
        <button
          onClick={() => onAskAI(`What infrastructure improvements should be prioritized in ${area.name}?`)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Bot className="w-4 h-4 text-emerald-500" />
          <span>Ask AI Assistant about {area.name}</span>
        </button>
      )}
    </div>
  );
};
