import React, { useState } from 'react';
import { AreaInfo } from '../types';
import {
  Flame,
  Activity,
  GraduationCap,
  Train,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface HeatmapViewProps {
  areas: AreaInfo[];
  onSelectArea: (name: string) => void;
  onExploreMap: () => void;
  darkMode: boolean;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  areas,
  onSelectArea,
  onExploreMap,
  darkMode,
}) => {
  // All 5 heatmaps specified in prompt:
  // 1. Healthcare Coverage
  // 2. Education Coverage
  // 3. Transport Coverage
  // 4. Development Priority
  // 5. Overall Accessibility
  const [heatmapType, setHeatmapType] = useState<
    'healthcare' | 'education' | 'transport' | 'density' | 'priority' | 'growth' | 'overall'
  >('overall');

  const heatmapMeta = {
    overall: {
      title: 'Overall Accessibility Heatmap',
      desc: 'Composite spatial score: 40% Healthcare + 30% Education + 20% Transportation + 10% Government.',
      icon: TrendingUp,
      color: '#10b981',
    },
    healthcare: {
      title: 'Healthcare Heatmap (40% Weight)',
      desc: 'Density and buffer accessibility of hospitals, emergency clinics, maternity units, and trauma centers.',
      icon: Activity,
      color: '#ef4444',
    },
    education: {
      title: 'Education Heatmap (30% Weight)',
      desc: 'Geographic distribution of primary schools, senior secondary institutions, and accredited degree colleges.',
      icon: GraduationCap,
      color: '#3b82f6',
    },
    transport: {
      title: 'Transport Heatmap (20% Weight)',
      desc: 'Transit connectivity to Western Railway suburban terminals, junction stations, and municipal bus depots.',
      icon: Train,
      color: '#f59e0b',
    },
    density: {
      title: 'Population Density Heatmap',
      desc: 'Spatial distribution of citizen density (residents / km²) across municipal polygon boundaries.',
      icon: TrendingUp,
      color: '#8b5cf6',
    },
    priority: {
      title: 'Development Priority Heatmap',
      desc: 'Automated deficit hotspot identification where smart city capital expenditure is most urgently required.',
      icon: ShieldAlert,
      color: '#dc2626',
    },
    growth: {
      title: 'Growth Potential Heatmap',
      desc: 'Predictive urban expansion readiness based on vacant developable land, DFC rail corridors, and administrative decentralization.',
      icon: TrendingUp,
      color: '#06b6d4',
    },
  };

  const currentMeta = heatmapMeta[heatmapType];

  return (
    <div className="space-y-8 py-4">
      {/* Top Header & 5-Heatmap Switcher */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Multi-Layer GIS Heatmap System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentMeta.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
              {currentMeta.desc}
            </p>
          </div>

          <button
            onClick={onExploreMap}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            <span>View on Live Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Requested Heatmap Tabs + Overall */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'overall', label: 'Overall Accessibility', icon: TrendingUp },
            { id: 'healthcare', label: 'Healthcare Heatmap', icon: Activity },
            { id: 'education', label: 'Education Heatmap', icon: GraduationCap },
            { id: 'transport', label: 'Transport Heatmap', icon: Train },
            { id: 'density', label: 'Population Density', icon: TrendingUp },
            { id: 'priority', label: 'Development Priority', icon: ShieldAlert },
            { id: 'growth', label: 'Growth Potential', icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const active = heatmapType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setHeatmapType(item.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap Visual Matrix Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              District Spatial Score Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated dynamically from OpenStreetMap spatial asset density.
            </p>
          </div>

          {/* Color Gradient Key (Issue 2 GIS Color Scale) */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Tiers:</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
              <span className="text-slate-700 dark:text-slate-200 text-[11px] font-medium">Excellent (80+)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
              <span className="text-slate-700 dark:text-slate-200 text-[11px] font-medium">Good (65-79)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#FACC15]" />
              <span className="text-slate-700 dark:text-slate-200 text-[11px] font-medium">Moderate (50-64)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#F97316]" />
              <span className="text-slate-700 dark:text-slate-200 text-[11px] font-medium">Poor (35-49)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#DC2626]" />
              <span className="text-slate-700 dark:text-slate-200 text-[11px] font-medium">Critical (&lt;35)</span>
            </div>
          </div>
        </div>

        {/* Heatmap Zone Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {areas.map((area) => {
            let scoreVal = area.accessibilityScore;
            let label: string = area.categoryLabel;

            if (heatmapType === 'healthcare') {
              scoreVal = area.breakdown.healthcare;
              label = scoreVal >= 75 ? 'Good' : scoreVal >= 50 ? 'Moderate' : 'Critical';
            } else if (heatmapType === 'education') {
              scoreVal = area.breakdown.education;
              label = scoreVal >= 75 ? 'Good' : scoreVal >= 55 ? 'Moderate' : 'Poor';
            } else if (heatmapType === 'transport') {
              scoreVal = area.breakdown.transportation;
              label = scoreVal >= 75 ? 'Good' : scoreVal >= 55 ? 'Moderate' : 'Poor';
            } else if (heatmapType === 'density') {
              scoreVal = Math.min(100, Math.round(area.populationDensity / 150));
              label = `${area.populationDensity.toLocaleString()} /km²`;
            } else if (heatmapType === 'priority') {
              scoreVal = area.developmentPriorityScore;
              label = scoreVal >= 50 ? 'Critical' : scoreVal >= 35 ? 'Moderate' : 'Low';
            } else if (heatmapType === 'growth') {
              scoreVal = area.growthPotentialScore;
              label = scoreVal >= 85 ? 'High Expansion' : 'Active Growth';
            }

            // Gradient based on scoreVal matching proper GIS scale
            let borderStyle = 'border-[#0EA5E9]/40 from-[#0EA5E9]/15 via-[#0EA5E9]/5 to-transparent text-[#0EA5E9]';
            if (heatmapType === 'priority') {
              if (scoreVal >= 50) borderStyle = 'border-[#DC2626]/40 from-[#DC2626]/15 via-[#DC2626]/5 to-transparent text-[#DC2626]';
              else if (scoreVal >= 35) borderStyle = 'border-[#F97316]/40 from-[#F97316]/15 via-[#F97316]/5 to-transparent text-[#F97316]';
              else borderStyle = 'border-[#22C55E]/40 from-[#22C55E]/15 via-[#22C55E]/5 to-transparent text-[#22C55E]';
            } else {
              if (scoreVal >= 80) borderStyle = 'border-[#0EA5E9]/40 from-[#0EA5E9]/15 via-[#0EA5E9]/5 to-transparent text-[#0EA5E9]';
              else if (scoreVal >= 65) borderStyle = 'border-[#22C55E]/40 from-[#22C55E]/15 via-[#22C55E]/5 to-transparent text-[#22C55E]';
              else if (scoreVal >= 50) borderStyle = 'border-[#FACC15]/40 from-[#FACC15]/15 via-[#FACC15]/5 to-transparent text-[#FACC15]';
              else if (scoreVal >= 35) borderStyle = 'border-[#F97316]/40 from-[#F97316]/15 via-[#F97316]/5 to-transparent text-[#F97316]';
              else borderStyle = 'border-[#DC2626]/40 from-[#DC2626]/15 via-[#DC2626]/5 to-transparent text-[#DC2626]';
            }

            return (
              <div
                key={area.id}
                onClick={() => {
                  onSelectArea(area.name);
                  onExploreMap();
                }}
                className={`p-5 rounded-2xl border bg-gradient-to-b ${borderStyle} transition hover:scale-102 cursor-pointer space-y-3 shadow-xs`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {area.name}
                  </span>
                  <MapPin className="w-4 h-4 opacity-75" />
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    {heatmapType === 'priority' ? 'Priority Urgency' : 'Sector Index'}
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {scoreVal}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                </div>

                <div className="text-xs font-bold">{label} Status</div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {area.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
