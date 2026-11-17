import React from 'react';
import {
  Compass,
  Map,
  FileText,
  Activity,
  GraduationCap,
  Train,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { PALGHAR_AREAS, INFRASTRUCTURE_POINTS } from '../data/palgharData';
import { AreaInfo, InfrastructureItem } from '../types';

interface LandingHeroProps {
  onExploreMap: () => void;
  onGenerateReport: () => void;
  onSelectArea: (area: string) => void;
  areas?: AreaInfo[];
  features?: InfrastructureItem[];
  darkMode: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreMap,
  onGenerateReport,
  onSelectArea,
  areas = PALGHAR_AREAS,
  features = INFRASTRUCTURE_POINTS,
  darkMode,
}) => {
  const totalHospitals = features.filter((i) => i.category === 'hospital').length;
  const totalSchools = features.filter((i) => i.category === 'school').length;
  const totalRail = features.filter((i) => i.category === 'railway').length;
  const avgScore = Math.round(
    areas.reduce((acc, a) => acc + a.accessibilityScore, 0) / (areas.length || 1)
  );

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100/70 via-white/50 to-emerald-50/30 dark:from-slate-900/80 dark:via-slate-950/80 dark:to-emerald-950/20 backdrop-blur-xl shadow-xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Smart City Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart City Mission · Urban Decision Support System</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              GeoPulse Maharashtra
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              AI-Powered Smart City Infrastructure Analyzer
            </h2>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Analyze infrastructure accessibility and identify development opportunities across Palghar District. Powered by live OpenStreetMap spatial data, dynamic scoring, and Gemini AI planning intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreMap}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition active:scale-95 cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGenerateReport}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm shadow-sm transition active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Generate PDF Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* Animated Live Stats Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Hospitals */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-2 hover:-translate-y-1 transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
            {totalHospitals}
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Hospitals & Clinics
          </div>
          <p className="text-[11px] text-slate-400">
            Emergency & Primary Healthcare Centers
          </p>
        </div>

        {/* Stat 2: Schools */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-2 hover:-translate-y-1 transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
            {totalSchools}
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Schools & Colleges
          </div>
          <p className="text-[11px] text-slate-400">
            CBSE, State Schools & Senior Degree Colleges
          </p>
        </div>

        {/* Stat 3: Railway Stations */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-2 hover:-translate-y-1 transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Train className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
            {totalRail} Major
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Railway Stations
          </div>
          <p className="text-[11px] text-slate-400">
            Western Suburban & Express Rail Nodes
          </p>
        </div>

        {/* Stat 4: Accessibility Score */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-2 hover:-translate-y-1 transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
            {avgScore}/100
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Accessibility Score
          </div>
          <p className="text-[11px] text-slate-400">
            40% Health · 30% Edu · 20% Transit · 10% Govt
          </p>
        </div>
      </section>

      {/* Focus Area Quick Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Palghar District Focus Nodes
            </h3>
            <p className="text-xs text-slate-500">
              Click any area to inspect its accessibility score and AI planning recommendations.
            </p>
          </div>
          <button
            onClick={onExploreMap}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All on Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {areas.map((area) => {
            const badgeColor =
              area.accessibilityScore >= 80
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : area.accessibilityScore >= 65
                ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400 border-lime-500/30'
                : area.accessibilityScore >= 50
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : area.accessibilityScore >= 35
                ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';

            return (
              <div
                key={area.id}
                onClick={() => {
                  onSelectArea(area.name);
                  onExploreMap();
                }}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 backdrop-blur-md cursor-pointer transition space-y-3 group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                    {area.name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                  >
                    {area.categoryLabel}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-slate-500">Score</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {area.accessibilityScore}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {area.recommendation}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Pop: {area.population}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition">
                    Analyze →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
