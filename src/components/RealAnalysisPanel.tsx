import React from 'react';
import {
  Users,
  Activity,
  GraduationCap,
  Train,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X,
  PlusCircle,
  Navigation,
  School,
  Trees,
} from 'lucide-react';
import { AreaInfo } from '../types';

interface RealAnalysisPanelProps {
  area: AreaInfo;
  onClose?: () => void;
  onSimulateInArea: () => void;
  onOpenAiPlanner: () => void;
  darkMode: boolean;
}

export const RealAnalysisPanel: React.FC<RealAnalysisPanelProps> = ({
  area,
  onClose,
  onSimulateInArea,
  onOpenAiPlanner,
  darkMode,
}) => {
  const badgeColor =
    area.accessibilityScore >= 80
      ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30'
      : area.accessibilityScore >= 65
      ? 'text-[#84cc16] bg-[#84cc16]/10 border-[#84cc16]/30'
      : area.accessibilityScore >= 50
      ? 'text-[#eab308] bg-[#eab308]/10 border-[#eab308]/30'
      : area.accessibilityScore >= 35
      ? 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/30'
      : 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30';

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-5 shadow-2xl text-slate-900 dark:text-slate-100 space-y-3.5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {area.taluka} Taluka
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {area.categoryLabel}
            </span>
          </div>
          <h3 className="text-lg font-black tracking-tight mt-0.5 flex items-center gap-2">
            {area.name} GIS Analysis
          </h3>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary KPI Grid: Population, Hospitals, Schools, Colleges, Stations */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Population */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <Users className="w-3.5 h-3.5 text-sky-500" />
            <span>Population</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
            {area.population}
          </div>
        </div>

        {/* Accessibility Score */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Accessibility Score</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {area.accessibilityScore} <span className="text-[10px] font-normal text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Hospitals */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>Hospitals & Clinics</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
            {area.counts.hospitals} <span className="text-[10px] font-normal text-slate-400">facilities</span>
          </div>
        </div>

        {/* Schools & Colleges */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            <span>Schools & Colleges</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
            {area.counts.schools + area.counts.colleges} <span className="text-[10px] font-normal text-slate-400">({area.counts.colleges} colleges)</span>
          </div>
        </div>

        {/* Railway Stations */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <Train className="w-3.5 h-3.5 text-amber-500" />
            <span>Railway Stations</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
            {area.counts.railways} <span className="text-[10px] font-normal text-slate-400">suburban hub</span>
          </div>
        </div>

        {/* Development Priority */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Priority Rank</span>
          </div>
          <div className="text-xs font-extrabold text-rose-600 dark:text-rose-400 line-clamp-1">
            {area.priorityRank}
          </div>
        </div>
      </div>

      {/* GIS Buffer Coverage Analysis (1km, 3km, 5km) */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-blue-500" />
            <span>Catchment Coverage</span>
          </span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">
            {area.coverageAnalysis?.bedsPer1000 || 0.4} beds / 1k pop
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
          <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[9px] text-slate-400 font-sans">1km Radius</div>
            <div className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
              {area.coverageAnalysis?.coverage1km || 42}%
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[9px] text-slate-400 font-sans">3km Radius</div>
            <div className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
              {area.coverageAnalysis?.coverage3km || 75}%
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[9px] text-slate-400 font-sans">5km Radius</div>
            <div className="font-extrabold text-xs text-purple-600 dark:text-purple-400">
              {area.coverageAnalysis?.coverage5km || 92}%
            </div>
          </div>
        </div>
      </div>

      {/* Nearest Missing Facility Alert Box */}
      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Nearest Missing Facility:</span>
        </div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
          {area.nearestMissingFacility || 'Secondary Municipal Trauma Clinic (7.4 km away)'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <button
          onClick={onSimulateInArea}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Simulate Asset</span>
        </button>

        <button
          onClick={onOpenAiPlanner}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Suggestions</span>
        </button>
      </div>
    </div>
  );
};
