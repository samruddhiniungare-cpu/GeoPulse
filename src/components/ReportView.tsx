import React, { useState } from 'react';
import { AreaInfo, InfrastructureItem } from '../types';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface ReportViewProps {
  areas: AreaInfo[];
  features: InfrastructureItem[];
  lastUpdated?: string;
  darkMode: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  areas,
  features,
  lastUpdated = 'Live OpenStreetMap Sync',
  darkMode,
}) => {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('All');

  const filteredAreas =
    selectedAreaFilter === 'All'
      ? areas
      : areas.filter((a) => a.name === selectedAreaFilter);

  const totalHospitals = features.filter((i) => i.category === 'hospital').length;
  const allSchools = features.filter((i) => i.category === 'school');
  const totalColleges = allSchools.filter(
    (i) => i.subcategory.includes('College') || i.name.includes('College') || i.subcategory.includes('Institute')
  ).length;
  const totalSchoolsOnly = allSchools.length - totalColleges;
  const totalRail = features.filter((i) => i.category === 'railway').length;
  const districtAvgScore = Math.round(
    areas.reduce((acc, a) => acc + a.accessibilityScore, 0) / (areas.length || 1)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Action Bar (Hidden in print) */}
      <div className="no-print p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            Infrastructure Accessibility & Planning Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            1-Click PDF generation formatted for university project examination and municipal defense.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedAreaFilter}
            onChange={(e) => setSelectedAreaFilter(e.target.value)}
            className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All">All 5 Focus Areas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name} ({a.accessibilityScore}/100)
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl max-w-4xl mx-auto space-y-8 print:p-0 print:border-none print:shadow-none font-sans">
        {/* Report Header */}
        <div className="border-b pb-6 border-slate-200 dark:border-slate-800 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Palghar District Municipal Planning Authority · Digital Twin Decision Support Dossier
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              GeoPulse Maharashtra: Smart City Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live OpenStreetMap Infrastructure Accessibility, Gap Detection & Planning Dossier
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 font-medium space-y-0.5">
            <div>Target: <strong>Palghar District, Maharashtra</strong></div>
            <div>Sync: <strong>{lastUpdated}</strong></div>
            <div>Formula: <strong>40% Health · 30% Edu · 20% Transit · 10% Govt</strong></div>
          </div>
        </div>

        {/* 1. Executive Summary & KPIs */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            1. Area Summary & District Statistics
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            This study evaluates live geospatial data across Palghar District, benchmarking public service accessibility in Virar, Vasai, Nalasopara, Palghar, and Boisar. Using weighted multi-criteria spatial scoring (40% Healthcare, 30% Education, 20% Transportation, 10% Government Services), the platform detects municipal deficit hotspots and formulates quantified planning interventions.
          </p>

          <div className="grid grid-cols-5 gap-2.5 pt-2 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{totalHospitals}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Hospitals</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{totalColleges}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Colleges</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{totalSchoolsOnly}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Schools</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{totalRail} Major</div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Rail Stations</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{districtAvgScore}/100</div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Avg Accessibility</div>
            </div>
          </div>
        </div>

        {/* 2. Heatmap Snapshot & Development Priority Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>2. Heatmap Snapshot & Development Priority Rankings</span>
          </h3>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3">Area Name</th>
                  <th className="py-2.5 px-3">Population</th>
                  <th className="py-2.5 px-3">Accessibility</th>
                  <th className="py-2.5 px-3">Hospitals / Colleges</th>
                  <th className="py-2.5 px-3">Bed Ratio</th>
                  <th className="py-2.5 px-3">1km Coverage</th>
                  <th className="py-2.5 px-3">Development Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...areas]
                  .sort((a, b) => b.developmentPriorityScore - a.developmentPriorityScore)
                  .map((a, i) => (
                    <tr key={a.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        #{i + 1} {a.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{a.population}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {a.accessibilityScore}/100
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {a.counts.hospitals} Hosp · {a.counts.colleges} Col
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {a.coverageAnalysis?.bedsPer1000 || 0.4} / 1k
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {a.coverageAnalysis?.coverage1km || 40}%
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-rose-600 dark:text-rose-400">
                        {a.priorityRank}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Detailed Infrastructure Analysis & AI Recommendations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            3. Area Summaries & Actionable AI Recommendations
          </h3>

          <div className="space-y-3">
            {filteredAreas.map((area) => (
              <div
                key={area.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {area.name} — Score: {area.accessibilityScore}/100 ({area.categoryLabel})
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">{area.priorityRank}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Strengths: </span>
                    {area.strengths.join('; ')}
                  </div>
                  <div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">Weaknesses: </span>
                    {area.weaknesses.join('; ')}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-medium">
                  <span className="font-bold">Nearest Missing Facility: </span>
                  {area.nearestMissingFacility}
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">AI Recommendation: </span>
                  {area.recommendation}
                </div>

                {/* SWOT Highlights */}
                {area.swot && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300">
                      <strong>Key Opportunity:</strong> {area.swot.opportunities[0] || 'Transit expansion'}
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
                      <strong>Future Risk:</strong> {area.swot.risks[0] || 'Commuter congestion'}
                    </div>
                  </div>
                )}

                {/* Top Capital Opportunities */}
                {area.developmentOpportunities && area.developmentOpportunities.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Top Capital Investment Interventions:
                    </div>
                    <div className="space-y-1">
                      {area.developmentOpportunities.map((opp) => (
                        <div key={opp.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                          <div>
                            <strong className="text-slate-800 dark:text-slate-200">{opp.title}</strong>
                            <span className="text-slate-400 ml-1.5">({opp.priority} Priority · {opp.timeframe})</span>
                          </div>
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-right">
                            {opp.estimatedCost} <span className="text-[10px] text-slate-400 font-normal">(+{opp.impactScore} pts)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Municipal Decision Support & Investment Roadmap */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            4. Smart City Capital Investment & Governance Roadmap
          </h3>
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <p>
              • <strong>Phase 1 (0-12 Months):</strong> Fast-track critical healthcare interventions including the 200-bed hospital in Nalasopara East and the 80-bed chemical burn center near Tarapur MIDC in Boisar.
            </p>
            <p>
              • <strong>Phase 2 (12-24 Months):</strong> Construct the Vasai East-West arterial bypass flyover and Virar multi-modal station skywalk to resolve commuter crush load.
            </p>
            <p>
              • <strong>Phase 3 (24-36 Months):</strong> Establish the Palghar District Government Medical College & Hospital and regional tribal transit network.
            </p>
          </div>
        </div>

        {/* Sign-off Block */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-xs text-slate-500">
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-1"></div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Chief Town Planner & GIS Directorate</div>
            <div>Palghar Municipal Corporation & Urban Development Dept.</div>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-1"></div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Municipal Commissioner / District Collector</div>
            <div>Infrastructure Planning & Decision Support Authority</div>
          </div>
        </div>
      </div>
    </div>
  );
};
