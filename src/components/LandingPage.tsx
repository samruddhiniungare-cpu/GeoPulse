import React from 'react';
import {
  Compass,
  MapPin,
  Activity,
  GraduationCap,
  Train,
  Building2,
  TreePine,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Flame,
  Bot,
  Zap,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';
import { AreaInfo, InfrastructureItem } from '../types';

interface LandingPageProps {
  onExploreDistrict: (areaName?: string) => void;
  areas: AreaInfo[];
  features: InfrastructureItem[];
  lastUpdated: string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDistrict,
  areas,
  features,
  lastUpdated,
  darkMode,
  setDarkMode,
}) => {
  // Aggregate real GIS stats
  const totalHospitals = features.filter((f) => f.category === 'hospital').length;
  const totalColleges = features.filter(
    (f) =>
      f.category === 'school' &&
      (f.subcategory.toLowerCase().includes('college') ||
        f.subcategory.toLowerCase().includes('institute') ||
        f.name.toLowerCase().includes('college'))
  ).length;
  const totalSchools = features.filter((f) => f.category === 'school').length - totalColleges;
  const totalRailways = features.filter((f) => f.category === 'railway').length;
  const totalBuses = features.filter((f) => f.category === 'bus').length;
  const totalGovAndParks = features.filter(
    (f) => f.category === 'government' || f.category === 'park'
  ).length;

  const districtScore = Math.round(
    areas.reduce((acc, a) => acc + a.accessibilityScore, 0) / (areas.length || 1)
  );

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  GeoPulse Maharashtra
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Palghar Smart City
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                AI-Powered Infrastructure & Accessibility Intelligence
              </p>
            </div>
          </div>

          {/* Nav Links & Action */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#overview" className="hover:text-emerald-500 transition">
              Overview
            </a>
            <a href="#features" className="hover:text-emerald-500 transition">
              Smart City Features
            </a>
            <a href="#statistics" className="hover:text-emerald-500 transition">
              Live GIS Data
            </a>
            <a href="#focus-areas" className="hover:text-emerald-500 transition">
              Focus Areas
            </a>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* PRIMARY CTA: Explore District */}
            <button
              onClick={() => onExploreDistrict()}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer"
            >
              <span>Explore District</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 dark:from-slate-950 dark:via-slate-900/60 dark:to-emerald-950/20">
        {/* Glow ambient background orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            {/* Decision Support Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart City Mission · Palghar District Urban Decision Support Platform</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                GeoPulse Maharashtra
              </h1>
              <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent leading-tight">
                AI-Powered Smart City Infrastructure & Accessibility Intelligence Platform
              </h2>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              A comprehensive geospatial intelligence system providing real-time multi-criteria accessibility modeling, isochrone buffer analysis, and municipal infrastructure simulation for the high-growth corridor of <span className="font-semibold text-slate-900 dark:text-white">Virar, Vasai, Nalasopara, Palghar, and Boisar</span>. Powered by live OpenStreetMap data and Gemini AI planning intelligence.
            </p>

            {/* Live Data Badge */}
            <div className="inline-flex flex-wrap items-center gap-3 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono shadow-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live OpenStreetMap Sync Active</span>
              </div>
              <span>·</span>
              <span>{features.length} Real Spatial Facilities</span>
              <span>·</span>
              <span>100% Free OSM Tiles (Zero API Key)</span>
            </div>

            {/* CALL TO ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onExploreDistrict()}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Explore District</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href="#focus-areas"
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs transition active:scale-95"
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>View Focus Areas ({areas.length})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE INFRASTRUCTURE STATISTICS */}
      <section id="statistics" className="py-14 sm:py-18 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                Verified Geographic Nodes
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Real-Time Infrastructure Inventory
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Every facility is an actual verified geographic point from OpenStreetMap within municipal boundaries.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
              <TrendingUp className="w-4 h-4" />
              <span>District Accessibility Index: <strong>{districtScore}/100</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Hospitals */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 hover:border-rose-400 transition">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {totalHospitals}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Hospitals & Clinics
              </div>
              <p className="text-[11px] text-slate-400">
                Tertiary, Trauma & Municipal PHCs
              </p>
            </div>

            {/* 2. Colleges */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 hover:border-purple-400 transition">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {totalColleges}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Colleges & Institutes
              </div>
              <p className="text-[11px] text-slate-400">
                Engineering, Pharmacy & Degree
              </p>
            </div>

            {/* 3. Schools */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 hover:border-blue-400 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {totalSchools}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Secondary Schools
              </div>
              <p className="text-[11px] text-slate-400">
                CBSE, ICSE & State High Schools
              </p>
            </div>

            {/* 4. Railways */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 hover:border-amber-400 transition">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Train className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {totalRailways}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Railway Stations
              </div>
              <p className="text-[11px] text-slate-400">
                Suburban & Mainline Corridors
              </p>
            </div>

            {/* 5. Bus Depots */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 hover:border-emerald-400 transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {totalBuses}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Bus Terminals
              </div>
              <p className="text-[11px] text-slate-400">
                MSRTC & VVMT Feeder Stations
              </p>
            </div>

            {/* 6. Total Live Assets */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {features.length}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Live Assets
              </div>
              <p className="text-[11px] text-slate-400">
                Indexed in Spatial Database
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROJECT OVERVIEW & GIS ARCHITECTURE */}
      <section id="overview" className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Problem & Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Urban Planning Context & Engineering Vision</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Addressing Spatial Disparities in Northern MMR
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Palghar District represents one of the fastest urbanizing corridors in India. While suburban railway stations like Virar and Nalasopara handle over 1 million commuters daily, civic social infrastructure has lagged behind residential population influx.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      Rigorous 40-30-20-10 Accessibility Formula
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      40% Healthcare + 30% Education + 20% Transit Connectivity + 10% Public Administration & Recreation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      Real Multi-Point Polygon Boundaries
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      No artificial circles. Each municipal area is evaluated using actual geographical coordinates and ray-casting polygon intersection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      100% Free OpenStreetMap & Leaflet Stack
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Completely free from commercial vendor lock-in. Powered by standard OSM tile layers without external API keys or authentication requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Formula Breakdown Card */}
            <div className="lg:col-span-6">
              <div className="p-7 sm:p-9 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Smart City Scoring Weight Breakdown
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-500">
                    Weighted Index
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Healthcare 40% */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-rose-500">
                        <Activity className="w-3.5 h-3.5" /> Healthcare Coverage
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">40% Weight</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      WHO 2.0 beds/1,000 ratio, emergency trauma distance decay & tertiary ICU availability.
                    </span>
                  </div>

                  {/* Education 30% */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-purple-500">
                        <GraduationCap className="w-3.5 h-3.5" /> Education Access
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">30% Weight</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Degree colleges, pharmacy/engineering institutes, and secondary school population ratio.
                    </span>
                  </div>

                  {/* Transportation 20% */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-amber-500">
                        <Train className="w-3.5 h-3.5" /> Transit Connectivity
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">20% Weight</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Suburban railway terminal capacity, MSRTC state bus hubs, and local VVMT feeder lines.
                    </span>
                  </div>

                  {/* Government 10% */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <Building2 className="w-3.5 h-3.5" /> Civic Governance & Green
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">10% Weight</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '10%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Municipal administrative ward headquarters, law enforcement, disaster response & public parks.
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Palghar District Formula Output</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    100 Points Scale
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SMART CITY FEATURES */}
      <section id="features" className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
              Core Capabilities
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered for Modern Smart City Governance
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Transforming raw OpenStreetMap data into actionable municipal intelligence and capital expenditure planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Simulation */}
            <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-500 transition duration-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Interactive Infrastructure Simulation
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Virtually position a new hospital, school, or bus terminal on the map and watch the district scoring engine compute instant before/after delta scores (e.g. +16 to +18 points).
              </p>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Smart Planning Mode</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2: Multi-layer Heatmaps */}
            <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-purple-500 transition duration-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Animated Multi-Layer Heatmaps
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Toggle between dedicated GIS heatmaps for Healthcare Coverage, Education Access, Transit Density, and Development Priority using professional chromatic scales.
              </p>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <span>Dynamic Spatial Density</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3: Catchment Isochrone Buffers */}
            <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-cyan-500 transition duration-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                1km, 3km, 5km Isochrone Buffers
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Compute true walkable and transit service areas around hospitals and railway nodes with dynamic catchment percentages to locate spatial dead zones.
              </p>
              <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <span>Spatial Catchment Engine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4: Gap Detection */}
            <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-rose-500 transition duration-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Infrastructure Gap Detection
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically detects missing critical infrastructure like 200-bed municipal hospitals in Nalasopara or industrial chemical burn centers near Tarapur MIDC in Boisar.
              </p>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <span>Deficit Ranking System</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5: AI Urban Planner */}
            <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-500 transition duration-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Gemini 3.8 AI Urban Planner
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Consult an AI urban planning engine grounded strictly in verified Palghar spatial metrics, bed ratios, and transit footfalls for municipal budget proposals.
              </p>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span>Data-Grounded Reasoning</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6: Real Facility Search */}
            <div className="p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-amber-500 transition duration-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Real Spatial Search & Fly-To
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Search real landmarks like "St John College", "Sanjivani Hospital", or "Virar Station" and smoothly fly directly to their exact geographic coordinates on OpenStreetMap.
              </p>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>Instant Coordinates Navigation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOCUS AREAS DEEP DIVE */}
      <section id="focus-areas" className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                Municipal Zones
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Palghar District Focus Areas
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore individual municipal zones with live counts, accessibility rankings, and missing infrastructure.
              </p>
            </div>

            <button
              onClick={() => onExploreDistrict()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <span>Explore All on GIS Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => {
              const badgeBg =
                area.accessibilityScore >= 80
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : area.accessibilityScore >= 65
                  ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400 border-lime-500/30'
                  : area.accessibilityScore >= 50
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';

              return (
                <div
                  key={area.id}
                  className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-emerald-500/50 transition duration-200 space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                            {area.name}
                          </h4>
                          <span className="text-xs font-mono text-slate-400">
                            {area.taluka}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Population: <strong>{area.population}</strong>
                        </p>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right">
                        <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                          {area.accessibilityScore}
                          <span className="text-xs text-slate-400 font-normal">/100</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                          {area.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Facility Breakdown Counters */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-base font-extrabold font-mono text-rose-500">
                          {area.counts.hospitals}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">Hospitals</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-base font-extrabold font-mono text-purple-500">
                          {area.counts.schools + area.counts.colleges}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">Schools & Col.</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-base font-extrabold font-mono text-amber-500">
                          {area.counts.railways + area.counts.buses}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">Transit Hubs</div>
                      </div>
                    </div>

                    {/* Critical Missing Asset */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-rose-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Critical Missing Facility</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug font-medium line-clamp-2">
                        {area.nearestMissingFacility}
                      </p>
                    </div>
                  </div>

                  {/* Explore Area CTA */}
                  <button
                    onClick={() => onExploreDistrict(area.name)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white font-bold text-xs transition duration-150 active:scale-95 cursor-pointer"
                  >
                    <span>Launch {area.name} in GIS Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION (CTA) SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>Interactive Palghar Smart City GIS Engine</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Explore Palghar District's Spatial Intelligence?
          </h3>

          <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Access real-time coverage buffers, dynamic multi-layer heatmaps, smart planning simulation, and data-grounded Gemini AI recommendations.
          </p>

          <div className="pt-4">
            <button
              onClick={() => onExploreDistrict()}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-white text-slate-950 hover:bg-emerald-50 font-black text-base shadow-2xl transition transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Explore District Dashboard</span>
              <ArrowRight className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white">
              GeoPulse Maharashtra
            </span>
            <span>·</span>
            <span>Palghar District Urban Infrastructure Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Map Data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-600 dark:text-emerald-400">OpenStreetMap contributors</a></span>
            <span>·</span>
            <span>Leaflet GIS Engine</span>
            <span>·</span>
            <span>No External API Keys Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
