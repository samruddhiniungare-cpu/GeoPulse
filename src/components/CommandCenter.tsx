import React from 'react';
import { Activity, GraduationCap, Train, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { AreaInfo } from '../types';

interface CommandCenterProps {
  area: AreaInfo;
  onSelectHeatmap?: (layer: 'healthcare' | 'education' | 'transport' | 'priority') => void;
  activeHeatmap?: string;
  darkMode: boolean;
}

interface CircularProgressProps {
  score: number;
  label: string;
  subtext: string;
  weight: string;
  color: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  score,
  label,
  subtext,
  weight,
  color,
  icon,
  isActive,
  onClick,
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-3xl border transition duration-300 cursor-pointer flex items-center gap-4 group ${
        isActive
          ? 'bg-slate-900 border-slate-700 shadow-xl ring-2'
          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
      style={{
        boxShadow: isActive ? `0 10px 25px -5px ${color}25` : undefined,
      }}
    >
      {/* Radial SVG Ring */}
      <div className="relative w-22 h-22 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          {/* Background circle track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="7"
            className="stroke-slate-100 dark:stroke-slate-800/80 fill-transparent"
          />
          {/* Progress stroke with glowing round cap */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              stroke: color,
              filter: `drop-shadow(0 0 4px ${color}80)`,
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
            className="fill-transparent"
          />
        </svg>

        {/* Center Score & Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-black font-mono tracking-tight text-slate-900 dark:text-white leading-none">
            {score}
          </span>
          <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Metric Labels */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
            {label}
          </span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.2 rounded-md font-mono"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {weight}
          </span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-1">{subtext}</p>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          {icon} <span>Inspect Heatmap →</span>
        </span>
      </div>
    </div>
  );
};

export const CommandCenter: React.FC<CommandCenterProps> = ({
  area,
  onSelectHeatmap,
  activeHeatmap,
  darkMode,
}) => {
  return (
    <section className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Command Center Metrics:
          </span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
            {area.name} Focus Node
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Click any ring to activate live GIS heatmap overlay
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Healthcare Coverage */}
        <CircularProgress
          score={area.breakdown.healthcare}
          label="Healthcare Coverage"
          subtext={`${area.counts.hospitals} Hospitals · ${area.coverageAnalysis?.bedsPer1000 || 0.4} beds/1k`}
          weight="40% Weight"
          color="#ef4444"
          icon={<Activity className="w-3 h-3 text-rose-500" />}
          isActive={activeHeatmap === 'healthcare'}
          onClick={() => onSelectHeatmap && onSelectHeatmap('healthcare')}
        />

        {/* 2. Education Coverage */}
        <CircularProgress
          score={area.breakdown.education}
          label="Education Coverage"
          subtext={`${area.counts.schools} Schools · ${area.counts.colleges} Colleges`}
          weight="30% Weight"
          color="#3b82f6"
          icon={<GraduationCap className="w-3 h-3 text-blue-500" />}
          isActive={activeHeatmap === 'education'}
          onClick={() => onSelectHeatmap && onSelectHeatmap('education')}
        />

        {/* 3. Transport Coverage */}
        <CircularProgress
          score={area.breakdown.transportation}
          label="Transport Coverage"
          subtext={`${area.counts.railways} Rail Hub · ${area.counts.buses} Bus Depots`}
          weight="20% Weight"
          color="#f59e0b"
          icon={<Train className="w-3 h-3 text-amber-500" />}
          isActive={activeHeatmap === 'transport'}
          onClick={() => onSelectHeatmap && onSelectHeatmap('transport')}
        />

        {/* 4. Development Priority */}
        <CircularProgress
          score={area.developmentPriorityScore}
          label="Development Priority"
          subtext={area.priorityRank}
          weight="Urgency Index"
          color="#dc2626"
          icon={<ShieldAlert className="w-3 h-3 text-rose-600" />}
          isActive={activeHeatmap === 'priority'}
          onClick={() => onSelectHeatmap && onSelectHeatmap('priority')}
        />
      </div>
    </section>
  );
};
