import React, { useState } from 'react';
import {
  X,
  Scale,
  TrendingUp,
  Activity,
  GraduationCap,
  Train,
  Building2,
  TreePine,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { AreaInfo } from '../types';

interface CompareAreasModalProps {
  areas: AreaInfo[];
  defaultAreaA?: string;
  defaultAreaB?: string;
  onClose: () => void;
  onSelectAreaForDashboard?: (areaName: string) => void;
  darkMode: boolean;
}

export const CompareAreasModal: React.FC<CompareAreasModalProps> = ({
  areas,
  defaultAreaA = 'Virar',
  defaultAreaB = 'Palghar',
  onClose,
  onSelectAreaForDashboard,
  darkMode,
}) => {
  const [areaAName, setAreaAName] = useState<string>(defaultAreaA);
  const [areaBName, setAreaBName] = useState<string>(
    defaultAreaB === defaultAreaA ? (areas.find((a) => a.name !== defaultAreaA)?.name || 'Vasai') : defaultAreaB
  );

  const areaA = areas.find((a) => a.name === areaAName) || areas[0];
  const areaB = areas.find((a) => a.name === areaBName) || areas[1] || areas[0];

  const presets = [
    { a: 'Virar', b: 'Palghar', label: 'Virar vs Palghar' },
    { a: 'Virar', b: 'Boisar', label: 'Virar vs Boisar' },
    { a: 'Palghar', b: 'Vasai', label: 'Palghar vs Vasai' },
    { a: 'Vasai', b: 'Nalasopara', label: 'Vasai vs Nalasopara' },
  ];

  const [activeTab, setActiveTab] = useState<'pair' | 'matrix'>('pair');

  const renderComparisonRow = (
    label: string,
    valA: string | number,
    valB: string | number,
    numA?: number,
    numB?: number,
    isScore = false
  ) => {
    let higherA = false;
    let higherB = false;

    if (numA !== undefined && numB !== undefined) {
      if (numA > numB) higherA = true;
      else if (numB > numA) higherB = true;
    }

    return (
      <div className="grid grid-cols-12 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs sm:text-sm">
        <div
          className={`col-span-4 font-mono font-bold text-center ${
            higherA
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {valA}
          {isScore && <span className="text-[10px] text-slate-400 font-normal"> /100</span>}
        </div>

        <div className="col-span-4 text-center text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </div>

        <div
          className={`col-span-4 font-mono font-bold text-center ${
            higherB
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {valB}
          {isScore && <span className="text-[10px] text-slate-400 font-normal"> /100</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Multi-Criteria Area Comparison Engine
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  Palghar District DSS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Benchmarking Virar, Palghar, Boisar, Vasai, and Nalasopara across actual infrastructure data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('pair')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === 'pair'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Head-to-Head
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === 'matrix'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                5-Area Master Matrix
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'matrix' ? (
          /* 5-Area Side-by-Side Master Table */
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => (
                      <th key={name} className="py-3 px-3 text-center">
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {/* Population */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300">Population</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return <td key={name} className="py-3 px-3 text-center">{a?.population || '-'}</td>;
                    })}
                  </tr>
                  {/* Hospitals */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300">Hospitals & Clinics</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return (
                        <td key={name} className="py-3 px-3 text-center text-rose-600 dark:text-rose-400 font-bold">
                          {(a?.counts.hospitals || 0) + (a?.counts.clinics || 0)}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Schools */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300">Schools</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return (
                        <td key={name} className="py-3 px-3 text-center text-blue-600 dark:text-blue-400 font-bold">
                          {a?.counts.schools || 0}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Colleges */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300">Colleges & Universities</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return (
                        <td key={name} className="py-3 px-3 text-center text-purple-600 dark:text-purple-400 font-bold">
                          {(a?.counts.colleges || 0) + (a?.counts.universities || 0)}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Transport */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300">Transport Hubs (Rail + Bus)</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return (
                        <td key={name} className="py-3 px-3 text-center text-amber-600 dark:text-amber-400 font-bold">
                          {(a?.counts.railways || 0) + (a?.counts.buses || 0)}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Accessibility */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-emerald-500/5 font-extrabold">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white">Accessibility Score</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return (
                        <td key={name} className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 text-sm">
                          {a?.accessibilityScore}/100
                        </td>
                      );
                    })}
                  </tr>
                  {/* Growth Potential */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300">Growth Potential</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return (
                        <td key={name} className="py-3 px-3 text-center text-cyan-600 dark:text-cyan-400 font-bold">
                          {a?.growthPotentialScore}/100
                        </td>
                      );
                    })}
                  </tr>
                  {/* Development Priority */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300">Development Priority</td>
                    {['Virar', 'Vasai', 'Nalasopara', 'Palghar', 'Boisar'].map((name) => {
                      const a = areas.find((x) => x.name === name);
                      return (
                        <td key={name} className="py-3 px-3 text-center font-sans font-bold text-[11px]">
                          <span className={`px-2 py-0.5 rounded-full ${
                            a?.priorityRank.includes('Critical')
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                              : a?.priorityRank.includes('High')
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          }`}>
                            {a?.priorityRank || 'Normal'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Pairwise Head-to-Head Comparison */
          <>
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Quick Pairs:
              </span>
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setAreaAName(p.a);
                    setAreaBName(p.b);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    areaAName === p.a && areaBName === p.b
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Selectors Card */}
            <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Select Area A:
                </label>
                <select
                  value={areaAName}
                  onChange={(e) => setAreaAName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-sm text-slate-900 dark:text-white cursor-pointer focus:outline-none"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.accessibilityScore}/100)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Select Area B:
                </label>
                <select
                  value={areaBName}
                  onChange={(e) => setAreaBName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-sm text-slate-900 dark:text-white cursor-pointer focus:outline-none"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.accessibilityScore}/100)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="grid grid-cols-12 py-3 px-4 bg-slate-100 dark:bg-slate-800 font-extrabold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <div className="col-span-4 text-center text-slate-900 dark:text-white text-sm">
                  {areaA.name}
                </div>
                <div className="col-span-4 text-center">Metric</div>
                <div className="col-span-4 text-center text-slate-900 dark:text-white text-sm">
                  {areaB.name}
                </div>
              </div>

              <div className="p-4 space-y-1">
                {renderComparisonRow('Population', areaA.population, areaB.population, areaA.populationNum, areaB.populationNum)}
                {renderComparisonRow('Hospitals & Clinics', areaA.counts.hospitals + areaA.counts.clinics, areaB.counts.hospitals + areaB.counts.clinics, areaA.counts.hospitals + areaA.counts.clinics, areaB.counts.hospitals + areaB.counts.clinics)}
                {renderComparisonRow('Schools', areaA.counts.schools, areaB.counts.schools, areaA.counts.schools, areaB.counts.schools)}
                {renderComparisonRow('Colleges & Institutes', areaA.counts.colleges + areaA.counts.universities, areaB.counts.colleges + areaB.counts.universities, areaA.counts.colleges + areaA.counts.universities, areaB.counts.colleges + areaB.counts.universities)}
                {renderComparisonRow('Transport (Rail + Bus)', areaA.counts.railways + areaA.counts.buses, areaB.counts.railways + areaB.counts.buses, areaA.counts.railways + areaA.counts.buses, areaB.counts.railways + areaB.counts.buses)}
                {renderComparisonRow('Accessibility Score', areaA.accessibilityScore, areaB.accessibilityScore, areaA.accessibilityScore, areaB.accessibilityScore, true)}
                {renderComparisonRow('Growth Potential', areaA.growthPotentialScore, areaB.growthPotentialScore, areaA.growthPotentialScore, areaB.growthPotentialScore, true)}
                {renderComparisonRow('Development Priority', areaA.priorityRank, areaB.priorityRank, areaA.developmentPriorityScore, areaB.developmentPriorityScore)}
                {renderComparisonRow('Area Size', `${areaA.areaSizeKm2} km²`, `${areaB.areaSizeKm2} km²`, areaA.areaSizeKm2, areaB.areaSizeKm2)}
                {renderComparisonRow('Density', `${areaA.populationDensity.toLocaleString()} /km²`, `${areaB.populationDensity.toLocaleString()} /km²`, areaA.populationDensity, areaB.populationDensity)}
              </div>
            </div>
          </>
        )}

        {/* Strategic Verdict Card */}
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1.5">
          <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Smart City Decision Support Verdict</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <strong>{areaA.accessibilityScore > areaB.accessibilityScore ? areaA.name : areaB.name}</strong> leads in composite infrastructure maturity, while <strong>{areaA.developmentPriorityScore > areaB.developmentPriorityScore ? areaA.name : areaB.name}</strong> presents the highest municipal capital expenditure urgency ({areaA.developmentPriorityScore > areaB.developmentPriorityScore ? areaA.nearestMissingFacility : areaB.nearestMissingFacility}).
          </p>
        </div>
      </div>
    </div>
  );
};
