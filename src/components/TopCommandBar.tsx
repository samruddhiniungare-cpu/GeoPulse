import React from 'react';
import {
  Compass,
  MapPin,
  TrendingUp,
  FileText,
  Bot,
  Sun,
  Moon,
  Scale,
  Sparkles,
} from 'lucide-react';
import { AreaInfo } from '../types';

interface TopCommandBarProps {
  districtScore: number;
  lastUpdated: string;
  totalFacilities: number;
  selectedArea: string;
  onSelectArea: (area: string) => void;
  areas: AreaInfo[];
  isAiDrawerOpen: boolean;
  onToggleAiDrawer: () => void;
  onOpenReport: () => void;
  onOpenCompare?: () => void;
  onBackToLanding?: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  districtScore,
  lastUpdated,
  totalFacilities,
  selectedArea,
  onSelectArea,
  areas,
  isAiDrawerOpen,
  onToggleAiDrawer,
  onOpenReport,
  onOpenCompare,
  onBackToLanding,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand & District Score */}
        <div className="flex items-center gap-3">
          <div
            onClick={onBackToLanding}
            className="flex items-center gap-2 cursor-pointer group"
            title="Go to Landing Page"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  GeoPulse Maharashtra
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Smart City DSS
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>Palghar District Focus</span>
                <span>·</span>
                <span className="text-emerald-500 font-semibold">{totalFacilities} Verified Facilities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: 5 Focus Area Direct Selector Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 hidden md:inline">
            Focus Area:
          </span>
          {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((areaName) => {
            const isSelected = selectedArea.toLowerCase() === areaName.toLowerCase();
            return (
              <button
                key={areaName}
                onClick={() => {
                  onSelectArea(areaName);
                }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer active:scale-95 whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {areaName}
              </button>
            );
          })}
        </div>

        {/* Right: Compare + AI Urban Planner + PDF Report + Theme */}
        <div className="flex items-center gap-2">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-100/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
              title="Return to Landing Page"
            >
              <span>← Landing</span>
            </button>
          )}

          {/* Compare Areas Button */}
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-400 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-xs"
              title="Compare Palghar Municipal Areas"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline">Compare</span>
            </button>
          )}

          {/* AI Urban Planner Button */}
          <button
            onClick={onToggleAiDrawer}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
              isAiDrawerOpen
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400'
                : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden md:inline">AI Planner</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-xs"
            title="Generate Smart City Report"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden lg:inline">Report PDF</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
