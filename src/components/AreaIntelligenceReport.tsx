import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  Activity,
  GraduationCap,
  Train,
  Building2,
  TreePine,
  Shield,
  Flame,
  Landmark,
  Coins,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  Users,
  Compass,
  Zap,
  Scale,
  ShieldAlert,
  Clock,
  IndianRupee,
  FileText,
  Bot,
  Sliders,
} from 'lucide-react';
import { AreaInfo, InfrastructureItem, DevelopmentOpportunity } from '../types';
import { AREA_SWOT_DATA } from '../data/palgharData';

interface AreaIntelligenceReportProps {
  area: AreaInfo;
  allFacilities: InfrastructureItem[];
  onSelectFacility: (facility: InfrastructureItem) => void;
  onSimulateOpportunity: (opp: DevelopmentOpportunity) => void;
  onOpenInvestmentPlanner?: () => void;
  onOpenCompare: () => void;
  onOpenAiPlanner: () => void;
  onHighlightGapsOnMap?: () => void;
  onExploreMap: () => void;
  onOpenReport?: () => void;
  darkMode: boolean;
}

export const AreaIntelligenceReport: React.FC<AreaIntelligenceReportProps> = ({
  area,
  allFacilities,
  onSelectFacility,
  onSimulateOpportunity,
  onOpenCompare,
  onOpenAiPlanner,
  onHighlightGapsOnMap,
  onExploreMap,
  onOpenReport,
  darkMode,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchFacilityQuery, setSearchFacilityQuery] = useState<string>('');
  const [investmentBudget, setInvestmentBudget] = useState<number>(100);

  // Filter facilities belonging to this area
  const areaFacilities = allFacilities.filter((f) => f.area === area.name);

  // SWOT Intelligence Resolution
  const swotData =
    area.swot && area.swot.strengths?.length > 0
      ? area.swot
      : AREA_SWOT_DATA[area.name] || {
          strengths: area.strengths || [],
          weaknesses: area.weaknesses || [],
          opportunities: [
            'Transit-Oriented Development corridor expansion',
            'Zoning reforms to accelerate private healthcare and school investments',
          ],
          risks: [
            'Monsoon urban waterlogging in low-lying basins',
            'Peak commuter congestion along suburban rail approach arteries',
          ],
        };

  // Category identification predicates for all 10 priority categories
  const isHospital = (f: InfrastructureItem) =>
    f.category === 'hospital' &&
    !f.subcategory.toLowerCase().includes('clinic') &&
    !f.name.toLowerCase().includes('clinic') &&
    !f.subcategory.toLowerCase().includes('phc');

  const isClinic = (f: InfrastructureItem) =>
    f.category === 'clinic' ||
    f.subcategory.toLowerCase().includes('clinic') ||
    f.name.toLowerCase().includes('clinic') ||
    f.subcategory.toLowerCase().includes('phc') ||
    f.subcategory.toLowerCase().includes('dispensary');

  const isCollege = (f: InfrastructureItem) =>
    f.category === 'college' ||
    ((f.category === 'school' &&
      (f.subcategory.toLowerCase().includes('college') ||
        f.name.toLowerCase().includes('college') ||
        f.subcategory.toLowerCase().includes('institute') ||
        f.name.toLowerCase().includes('institute'))) &&
      !f.subcategory.toLowerCase().includes('university') &&
      !f.name.toLowerCase().includes('university'));

  const isUniversity = (f: InfrastructureItem) =>
    f.category === 'university' ||
    f.subcategory.toLowerCase().includes('university') ||
    f.name.toLowerCase().includes('university') ||
    f.subcategory.toLowerCase().includes('campus');

  const isSchool = (f: InfrastructureItem) =>
    f.category === 'school' && !isCollege(f) && !isUniversity(f);

  const isRailway = (f: InfrastructureItem) => f.category === 'railway';

  const isBus = (f: InfrastructureItem) => f.category === 'bus';

  const isGovernment = (f: InfrastructureItem) => f.category === 'government';

  const isPolice = (f: InfrastructureItem) => f.category === 'police';

  const isPark = (f: InfrastructureItem) => f.category === 'park';

  // Category filter for inventory
  const filteredFacilities = areaFacilities.filter((f) => {
    const matchesQuery =
      !searchFacilityQuery ||
      f.name.toLowerCase().includes(searchFacilityQuery.toLowerCase()) ||
      (f.address || '').toLowerCase().includes(searchFacilityQuery.toLowerCase()) ||
      f.subcategory.toLowerCase().includes(searchFacilityQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'hospitals') return isHospital(f);
    if (activeCategoryFilter === 'clinics') return isClinic(f);
    if (activeCategoryFilter === 'schools') return isSchool(f);
    if (activeCategoryFilter === 'colleges') return isCollege(f);
    if (activeCategoryFilter === 'universities') return isUniversity(f);
    if (activeCategoryFilter === 'railways') return isRailway(f);
    if (activeCategoryFilter === 'buses') return isBus(f);
    if (activeCategoryFilter === 'government') return isGovernment(f);
    if (activeCategoryFilter === 'police') return isPolice(f);
    if (activeCategoryFilter === 'parks') return isPark(f);
    return f.category === activeCategoryFilter;
  });

  // Calculate dynamic investment breakdown
  const calculateAllocations = (budget: number) => {
    let healthPct = 0.40;
    let eduPct = 0.20;
    let transitPct = 0.25;
    let civicPct = 0.15;

    if (area.name === 'Nalasopara') {
      healthPct = 0.50;
      transitPct = 0.25;
      eduPct = 0.15;
      civicPct = 0.10;
    } else if (area.name === 'Boisar') {
      healthPct = 0.40;
      transitPct = 0.35;
      civicPct = 0.15;
      eduPct = 0.10;
    } else if (area.name === 'Palghar') {
      healthPct = 0.45;
      transitPct = 0.25;
      eduPct = 0.20;
      civicPct = 0.10;
    } else if (area.name === 'Virar') {
      healthPct = 0.40;
      transitPct = 0.30;
      eduPct = 0.18;
      civicPct = 0.12;
    }

    const healthAmt = Math.round(budget * healthPct);
    const eduAmt = Math.round(budget * eduPct);
    const transitAmt = Math.round(budget * transitPct);
    const civicAmt = Math.max(1, budget - healthAmt - eduAmt - transitAmt);

    const expectedImprovement = Math.min(
      22,
      Math.round(Math.sqrt(budget) * 1.5 + (budget >= 100 ? 3 : 1))
    );

    return {
      health: { pct: Math.round(healthPct * 100), amt: healthAmt },
      edu: { pct: Math.round(eduPct * 100), amt: eduAmt },
      transit: { pct: Math.round(transitPct * 100), amt: transitAmt },
      civic: { pct: Math.round(civicPct * 100), amt: civicAmt },
      expectedImprovement,
      projectedScore: Math.min(100, area.accessibilityScore + expectedImprovement),
    };
  };

  const investmentPlan = calculateAllocations(investmentBudget);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    }
  };

  const badgeColor =
    area.accessibilityScore >= 80
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      : area.accessibilityScore >= 65
      ? 'text-lime-500 bg-lime-500/10 border-lime-500/30'
      : area.accessibilityScore >= 50
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-500 bg-rose-500/10 border-rose-500/30';

  return (
    <div id="area-intelligence-dossier" className="space-y-8 animate-in fade-in duration-300">
      {/* ==================================================================== */}
      {/* 1. AREA INTELLIGENCE PROFILE & DEMOGRAPHICS */}
      {/* ==================================================================== */}
      <section className="p-6 sm:p-9 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6 border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Palghar Smart City Decision Support Dossier
              </span>
              <span className="text-xs font-mono text-slate-400">
                {area.taluka} Taluka · Maharashtra
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                {area.categoryLabel} Infrastructure
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {area.name} Smart City Intelligence Report
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Grounded municipal decision support analysis answering: <strong>what exists</strong>, <strong>what is missing</strong>, <strong>what should be developed</strong>, and <strong>what impact it creates</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 font-medium">
              <span>Status: <strong className="text-slate-800 dark:text-slate-200">{area.currentDevelopmentStatus || 'Rapid Urban Growth Corridor'}</strong></span>
              <span>·</span>
              <span>Maturity: <strong className="text-emerald-600 dark:text-emerald-400">{area.infrastructureMaturity || 'Stage 3: Developing Conurbation'}</strong></span>
            </div>
          </div>

          {/* Quick Decision Support Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:border-emerald-500 transition cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-500" />
              <span>Compare Area</span>
            </button>

            <button
              onClick={onOpenAiPlanner}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Urban Planner</span>
            </button>

            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export Report PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* 8 Core Planning Profile Metrics (Issue 9: Area Name 28px, Score 24px, Pop 18px, Facility Counts 18px, Labels 14px) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Population (18px, Label 14px) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-slate-700 dark:text-[#94A3B8]">
              <Users className="w-3.5 h-3.5 text-sky-500" />
              <span>Population</span>
            </div>
            <div className="text-[18px] sm:text-xl font-bold font-mono text-slate-900 dark:text-white truncate">
              {area.population}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Registered citizens</p>
          </div>

          {/* 2. Area Size */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-slate-700 dark:text-[#94A3B8]">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Area Size</span>
            </div>
            <div className="text-[18px] sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
              {area.areaSizeKm2} <span className="text-xs font-normal text-[#94A3B8]">km²</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Municipal polygon</p>
          </div>

          {/* 3. Population Density */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-slate-700 dark:text-[#94A3B8]">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              <span>Density</span>
            </div>
            <div className="text-[18px] sm:text-xl font-bold font-mono text-slate-900 dark:text-white truncate">
              {area.populationDensity.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Residents / km²</p>
          </div>

          {/* 4. Accessibility Score (24px, Label 14px) */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Accessibility</span>
            </div>
            <div className="text-[24px] sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {area.accessibilityScore} <span className="text-xs font-normal opacity-70">/100</span>
            </div>
            <p className="text-[11px] font-bold text-emerald-500">{area.categoryLabel}</p>
          </div>

          {/* 5. Development Score */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-blue-600 dark:text-blue-400">
              <Building2 className="w-3.5 h-3.5" />
              <span>Development</span>
            </div>
            <div className="text-[18px] sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400">
              {area.developmentScore} <span className="text-xs font-normal opacity-70">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Social index</p>
          </div>

          {/* 6. Growth Potential */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-amber-600 dark:text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Growth Index</span>
            </div>
            <div className="text-[18px] sm:text-xl font-black font-mono text-amber-600 dark:text-amber-400">
              {area.growthPotentialScore} <span className="text-xs font-normal opacity-70">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Expansion readiness</p>
          </div>

          {/* 7. Healthcare Bed Ratio */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-rose-600 dark:text-rose-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Hospital Beds</span>
            </div>
            <div className="text-[18px] sm:text-xl font-black font-mono text-rose-600 dark:text-rose-400">
              {area.coverageAnalysis.bedsPer1000}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Per 1k (WHO: 2.0)</p>
          </div>

          {/* 8. Development Priority */}
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1">
            <div className="flex items-center gap-1 text-[14px] font-semibold text-purple-600 dark:text-purple-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Priority</span>
            </div>
            <div className="text-[16px] sm:text-lg font-black text-purple-600 dark:text-purple-400 truncate">
              {area.priorityRank}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Urgency rank</p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. STRATEGIC SWOT ANALYSIS (Strengths, Weaknesses, Opportunities, Risks) */}
      {/* ==================================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Strategic SWOT Intelligence: {area.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive municipal planning diagnostic highlighting core strengths, systemic weaknesses, investment opportunities, and operational risks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 rounded-2xl border border-emerald-500/25 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strengths
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                {swotData.strengths.length} Core Assets
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {swotData.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-5 rounded-2xl border border-rose-500/25 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Weaknesses
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400">
                {swotData.weaknesses.length} Bottlenecks
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {swotData.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-5 rounded-2xl border border-sky-500/25 bg-sky-50/40 dark:bg-sky-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400">
                <TrendingUp className="w-4 h-4 text-sky-500" /> Opportunities
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-400">
                {swotData.opportunities.length} Growth Levers
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {swotData.opportunities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold shrink-0">↗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="p-5 rounded-2xl border border-amber-500/25 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Risks & Threats
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                {swotData.risks.length} Vulnerabilities
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {swotData.risks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. INFRASTRUCTURE GAP ANALYSIS (What is missing?) */}
      {/* ==================================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/15 backdrop-blur-xl shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-rose-200/40 dark:border-rose-800/40">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Infrastructure Gap Analysis & Deficit Detection
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Automatically detected deficits in {area.name} benchmarked against Maharashtra municipal planning standards.
            </p>
          </div>

          {onHighlightGapsOnMap && (
            <button
              onClick={onHighlightGapsOnMap}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Locate Gaps on Map</span>
            </button>
          )}
        </div>

        {/* 4 Gap Categories: Healthcare, Schools, Public Transit, Civic/Gov */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Healthcare Gap */}
          <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold text-rose-600 dark:text-rose-400">
                <Activity className="w-4 h-4" /> Healthcare Gap
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                {area.coverageAnalysis.bedsPer1000} / 2.0 WHO standard
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {area.gaps?.hospitalGapReason || area.nearestMissingFacility}
            </p>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
              <span>Required:</span>
              <span>{area.developmentOpportunities[0]?.title || 'Multi-Specialty Municipal Facility'}</span>
            </div>
          </div>

          {/* Transport Gap */}
          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                <Train className="w-4 h-4" /> Transit & Commuter Bottleneck
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {area.counts.railways} Rail Hub · {area.counts.buses} Bus Depots
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {area.gaps?.transportGapReason || 'Commuter volume exceeds pedestrian platform and bus terminal turnaround capacity.'}
            </p>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
              <span>Required:</span>
              <span>{area.developmentOpportunities[1]?.title || 'Integrated Transit Terminal'}</span>
            </div>
          </div>

          {/* Education Gap */}
          <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold text-purple-600 dark:text-purple-400">
                <GraduationCap className="w-4 h-4" /> Education & Technical Skills Deficit
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {area.counts.colleges + area.counts.universities} Higher Institutes
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {area.gaps?.schoolGapReason || 'Suburban student density necessitates specialized technical research and skill development centers.'}
            </p>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
              <span>Required:</span>
              <span>{area.developmentOpportunities[3]?.title || 'Technical Skill & Knowledge Hub'}</span>
            </div>
          </div>

          {/* Civic & Green Governance Gap */}
          <div className="p-5 rounded-2xl border border-cyan-200 dark:border-cyan-900/60 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                <Building2 className="w-4 h-4" /> Civic, Disaster Response & Open Parks
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                {area.counts.parks} Parks · {area.counts.fire} Fire Stations
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {area.gaps?.govGapReason || 'Adequate administrative ward operations; expanded stormwater retention reservoirs required for flood resiliency.'}
            </p>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
              <span>Required:</span>
              <span>{area.developmentOpportunities[2]?.title || 'Ecological Stormwater & Green Reserve'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. DEVELOPMENT RECOMMENDATION ENGINE (Top 5 Recommendations) */}
      {/* ==================================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Top 5 Development Recommendations: {area.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritized smart city capital expenditure proposals with calculated score impact, budget cost, and timeline.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Ranked by Spatial ROI
          </span>
        </div>

        <div className="space-y-4">
          {area.developmentOpportunities.slice(0, 5).map((opp, idx) => (
            <div
              key={opp.id || idx}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-emerald-500/50 transition duration-200"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Project: <span className="text-emerald-600 dark:text-emerald-400">{opp.title}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getPriorityColor(opp.priority)}`}>
                    Priority: {opp.priority}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  <strong className="text-slate-900 dark:text-white">Reason:</strong> {opp.reason}
                </p>

                {/* 4 Metadata Badges: Cost, Difficulty, Timeline, Target Site */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/80 dark:border-slate-700/60">
                    💰 Cost: <strong className="text-emerald-600 dark:text-emerald-400">{opp.estimatedCost}</strong>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/80 dark:border-slate-700/60">
                    ⚙️ Difficulty: <strong className="text-blue-600 dark:text-blue-400">{opp.implementationDifficulty || 'Medium'}</strong>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/80 dark:border-slate-700/60">
                    ⏱️ Timeline: <strong className="text-amber-600 dark:text-amber-400">{opp.timeline || opp.timeframe}</strong>
                  </span>

                  <span className="text-slate-400 text-[11px] truncate">
                    📍 {opp.targetLocation}
                  </span>
                </div>
              </div>

              {/* Score Delta, Cost & Action */}
              <div className="flex lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left lg:text-right">
                  <div className="text-xs uppercase font-bold text-slate-400">
                    Expected Impact
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    +{opp.impactScore} Accessibility Score
                  </div>
                </div>

                <button
                  onClick={() => onSimulateOpportunity(opp)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Project</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. REAL INFRASTRUCTURE INVENTORY (What exists?) */}
      {/* ==================================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Real Infrastructure Inventory: {area.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified facilities with actual names, addresses, distances from municipal center, and service areas.
            </p>
          </div>

          {/* Search bar inside facility directory */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${area.name} facilities by name...`}
              value={searchFacilityQuery}
              onChange={(e) => setSearchFacilityQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Filters: 10 Priority Infrastructure Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Facilities', count: areaFacilities.length, icon: '🏛️' },
            { id: 'hospitals', label: 'Hospitals', count: areaFacilities.filter(isHospital).length, icon: '🏥' },
            { id: 'clinics', label: 'Clinics', count: areaFacilities.filter(isClinic).length, icon: '🩺' },
            { id: 'schools', label: 'Schools', count: areaFacilities.filter(isSchool).length, icon: '🏫' },
            { id: 'colleges', label: 'Colleges', count: areaFacilities.filter(isCollege).length, icon: '🎓' },
            { id: 'universities', label: 'Universities', count: areaFacilities.filter(isUniversity).length, icon: '🏛️' },
            { id: 'railways', label: 'Railway Stations', count: areaFacilities.filter(isRailway).length, icon: '🚆' },
            { id: 'buses', label: 'Bus Stops', count: areaFacilities.filter(isBus).length, icon: '🚌' },
            { id: 'government', label: 'Government Offices', count: areaFacilities.filter(isGovernment).length, icon: '🏢' },
            { id: 'police', label: 'Police Stations', count: areaFacilities.filter(isPolice).length, icon: '👮' },
            { id: 'parks', label: 'Parks & Green Spaces', count: areaFacilities.filter(isPark).length, icon: '🌳' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activeCategoryFilter === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Facilities Table with Distance and Service Area */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredFacilities.map((facility, idx) => (
              <div
                key={facility.id || idx}
                onClick={() => onSelectFacility(facility)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition text-xs group"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                      {idx + 1}. {facility.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {facility.subcategory}
                    </span>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1">
                    {facility.address || `${facility.area}, Palghar District`}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Service: <strong>{facility.details}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {facility.distanceKm !== undefined && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono">Distance from Center</span>
                      <div className="font-mono font-black text-slate-800 dark:text-slate-200">
                        {facility.distanceKm} km
                      </div>
                    </div>
                  )}

                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 group-hover:bg-emerald-500 group-hover:text-white transition">
                    <span>View Explorer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}

            {filteredFacilities.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No facilities matching your search query. Try another term or reset category filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. SMART INVESTMENT PLANNER (What impact will it create?) */}
      {/* ==================================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Smart Municipal Investment Planner
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Deficit-Grounded Allocation
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate capital expenditure budget for <strong>{area.name}</strong> to calculate sector allocation and score delta.
              </p>
            </div>
          </div>

          {/* Expected Score Delta Badge */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <TrendingUp className="w-4 h-4" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Projected Improvement
              </div>
              <div className="text-sm font-extrabold font-mono">
                {area.accessibilityScore} → {investmentPlan.projectedScore} pts{' '}
                <span className="text-emerald-500 font-bold">(+{investmentPlan.expectedImprovement} Points)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Input Slider & Buttons */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Capital Expenditure Budget (in ₹ Crores):
            </label>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ₹{investmentBudget} Crore
            </div>
          </div>

          <input
            type="range"
            min="25"
            max="300"
            step="25"
            value={investmentBudget}
            onChange={(e) => setInvestmentBudget(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />

          <div className="flex flex-wrap items-center gap-2">
            {[50, 100, 150, 200, 250].map((preset) => (
              <button
                key={preset}
                onClick={() => setInvestmentBudget(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  investmentBudget === preset
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                ₹{preset} Crore
              </button>
            ))}
          </div>
        </div>

        {/* 4 Sector Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Healthcare */}
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-rose-600 dark:text-rose-400">
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Healthcare</span>
              <span className="font-mono">{investmentPlan.health.pct}%</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ₹{investmentPlan.health.amt} Crore
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Funds new tertiary hospital beds and ICU trauma wings.
            </p>
          </div>

          {/* Education */}
          <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-purple-600 dark:text-purple-400">
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> Education</span>
              <span className="font-mono">{investmentPlan.edu.pct}%</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ₹{investmentPlan.edu.amt} Crore
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Upgrades secondary schools and technical skill labs.
            </p>
          </div>

          {/* Transportation */}
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1.5"><Train className="w-4 h-4" /> Transport</span>
              <span className="font-mono">{investmentPlan.transit.pct}%</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ₹{investmentPlan.transit.amt} Crore
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Skywalk concourse, bus depot electrification & flyovers.
            </p>
          </div>

          {/* Civic Services */}
          <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-50/20 dark:bg-cyan-950/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Civic & Green</span>
              <span className="font-mono">{investmentPlan.civic.pct}%</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ₹{investmentPlan.civic.amt} Crore
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Stormwater retention reservoirs, green parks & disaster posts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
