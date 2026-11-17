import React from 'react';
import {
  Activity,
  GraduationCap,
  Train,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Flame,
} from 'lucide-react';
import { AreaInfo, InfrastructureItem } from '../types';

interface DashboardViewProps {
  areas: AreaInfo[];
  features: InfrastructureItem[];
  onSelectArea: (area: string) => void;
  onExploreMap: () => void;
  lastUpdated?: string;
  darkMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  areas,
  features,
  onSelectArea,
  onExploreMap,
  lastUpdated = 'Live OpenStreetMap Sync',
  darkMode,
}) => {
  const totalHospitals = features.filter((i) => i.category === 'hospital').length;
  const totalSchools = features.filter((i) => i.category === 'school').length;
  const totalRail = features.filter((i) => i.category === 'railway').length;
  const districtAvgScore = Math.round(
    areas.reduce((acc, a) => acc + a.accessibilityScore, 0) / (areas.length || 1)
  );

  // Dynamic Development Priority Ranking (lowest accessibility score = highest development priority)
  const priorityRankings = [...areas].sort(
    (a, b) => b.developmentPriorityScore - a.developmentPriorityScore
  );

  return (
    <div className="space-y-8 py-4">
      {/* Top Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 font-mono">
              Live OpenStreetMap Data · {lastUpdated}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Palghar District Smart City Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time infrastructure accessibility scores and dynamic development priority rankings.
          </p>
        </div>

        <button
          onClick={onExploreMap}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95"
        >
          <span>Open Interactive Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* The 4 Core Metrics Requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Hospitals Count */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Hospitals Count
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
            {totalHospitals}
            <span className="text-sm font-normal text-slate-400 ml-1">facilities</span>
          </div>
          <p className="text-xs text-slate-500">
            Civil hospital, municipal clinics & tertiary centers
          </p>
        </div>

        {/* Metric 2: Schools Count */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Schools Count
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
            {totalSchools}
            <span className="text-sm font-normal text-slate-400 ml-1">campuses</span>
          </div>
          <p className="text-xs text-slate-500">
            High schools, CBSE centers & senior degree colleges
          </p>
        </div>

        {/* Metric 3: Railway Stations Count */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Railway Stations
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Train className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
            {totalRail}
            <span className="text-sm font-normal text-slate-400 ml-1">stations</span>
          </div>
          <p className="text-xs text-slate-500">
            Western Suburban Terminals & Express rail hubs
          </p>
        </div>

        {/* Metric 4: Accessibility Score */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              4. Accessibility Score
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
            {districtAvgScore}
            <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
          </div>
          <p className="text-xs text-slate-500">
            Formula: 40% Health, 30% Edu, 20% Transit, 10% Govt
          </p>
        </div>
      </div>

      {/* Dynamic Development Priority Ranking Dashboard */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              Dynamic Development Priority Ranking
            </h3>
            <p className="text-xs text-slate-500">
              Generated dynamically from spatial deficit indices and service coverage gaps.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Rank 1 = Most Urgent Need</span>
          </div>
        </div>

        {/* Ranking List Table */}
        <div className="space-y-3">
          {priorityRankings.map((area, idx) => {
            const isTopPriority = idx === 0;
            const priorityBadgeColor =
              area.developmentPriorityScore >= 50
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : area.developmentPriorityScore >= 35
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={area.id}
                onClick={() => {
                  onSelectArea(area.name);
                  onExploreMap();
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-wrap items-center justify-between gap-4 ${
                  isTopPriority
                    ? 'border-rose-500/40 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm font-mono ${
                      isTopPriority
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      {area.name}
                      <span className="text-xs text-slate-400 font-normal">({area.taluka} Taluka)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Pop: {area.population} · {area.recommendation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Accessibility Score</div>
                    <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                      {area.accessibilityScore} / 100
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${priorityBadgeColor}`}>
                    {area.priorityRank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
