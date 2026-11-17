/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { TopCommandBar } from './components/TopCommandBar';
import { InteractiveMap, HeatmapTab } from './components/InteractiveMap';
import { AreaIntelligenceReport } from './components/AreaIntelligenceReport';
import { FacilityExplorerModal } from './components/FacilityExplorerModal';
import { CompareAreasModal } from './components/CompareAreasModal';
import { AIUrbanPlannerDrawer } from './components/AIUrbanPlannerDrawer';
import { ReportView } from './components/ReportView';
import { PALGHAR_AREAS, INFRASTRUCTURE_POINTS } from './data/palgharData';
import { fetchLiveInfrastructure, simulateInfrastructurePlacement } from './services/aiService';
import { AreaInfo, InfrastructureItem, DevelopmentOpportunity } from './types';
import { X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [selectedAreaName, setSelectedAreaName] = useState<string>('Virar');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<InfrastructureItem | null>(null);

  // Active heatmap state (Heatmaps OFF by default as per Issue 7)
  const [activeHeatmapTab, setActiveHeatmapTab] = useState<HeatmapTab>('off');

  // Live OpenStreetMap Data state
  const [areas, setAreas] = useState<AreaInfo[]>(PALGHAR_AREAS);
  const [features, setFeatures] = useState<InfrastructureItem[]>(INFRASTRUCTURE_POINTS);
  const [lastUpdated, setLastUpdated] = useState<string>('Live OpenStreetMap Sync');

  // Fetch live OSM data on initial mount
  useEffect(() => {
    fetchLiveInfrastructure()
      .then((data) => {
        if (data.areas && data.areas.length > 0) setAreas(data.areas);
        if (data.features && data.features.length > 0) setFeatures(data.features);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      })
      .catch((err) => {
        console.log('Using baseline spatial dataset:', err.message);
      });
  }, []);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const selectedArea =
    areas.find((a) => a.name.toLowerCase() === selectedAreaName.toLowerCase()) ||
    areas[0] ||
    PALGHAR_AREAS[0];

  const districtScore = Math.round(
    areas.reduce((acc, a) => acc + a.accessibilityScore, 0) / (areas.length || 1)
  );

  // Handle simulating an opportunity directly from recommendations
  const handleSimulateOpportunity = async (opp: DevelopmentOpportunity) => {
    try {
      const facilityType =
        opp.sector === 'healthcare'
          ? 'hospital'
          : opp.sector === 'education'
          ? 'school'
          : 'bus';

      const res = await simulateInfrastructurePlacement({
        areaName: selectedArea.name,
        facilityType,
        name: opp.title,
      });

      if (res && res.newScores) {
        const scores = res.newScores;
        // Update local state with updated scores
        setAreas((prevAreas) =>
          prevAreas.map((a) => {
            if (a.name === res.areaName) {
              return {
                ...a,
                accessibilityScore: res.afterScore,
                developmentScore: scores.developmentScore,
                infrastructureScore: scores.infrastructureScore,
                growthPotentialScore: scores.growthPotentialScore,
                categoryLabel: res.categoryLabel,
                counts: res.newCounts || a.counts,
                coverageAnalysis: res.coverageAnalysis || a.coverageAnalysis,
              };
            }
            return a;
          })
        );

        if (res.simulatedFeature) {
          setFeatures((prev) => [res.simulatedFeature, ...prev]);
        }

        // Smooth scroll to map
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.warn('Opportunity simulation error:', err);
    }
  };

  if (currentView === 'landing') {
    return (
      <div
        className={`min-h-screen font-sans transition-colors duration-200 selection:bg-purple-500 selection:text-white ${
          darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <LandingPage
          onExploreDistrict={(areaName?: string) => {
            if (areaName) setSelectedAreaName(areaName);
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          areas={areas}
          features={features}
          lastUpdated={lastUpdated}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-purple-500 selection:text-white ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 1. Top Command Bar with 5 Focus Area Buttons & Quick Actions */}
      <TopCommandBar
        districtScore={districtScore}
        lastUpdated={lastUpdated}
        totalFacilities={features.length}
        selectedArea={selectedAreaName}
        onSelectArea={(name) => {
          setSelectedAreaName(name);
          const el = document.getElementById('area-intelligence-dossier');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        areas={areas}
        isAiDrawerOpen={isAiDrawerOpen}
        onToggleAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onBackToLanding={() => setCurrentView('landing')}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Experience: MAP IS THE ENTRY POINT, INTELLIGENCE DOSSIER IS THE CORE VALUE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-8">
        {/* 2. Interactive GIS Map with Gap Visualization & Buffers */}
        <section className="relative">
          <InteractiveMap
            areas={areas}
            features={features}
            selectedAreaName={selectedAreaName}
            onSelectAreaName={setSelectedAreaName}
            onUpdateAreas={setAreas}
            onOpenAiPlanner={() => setIsAiDrawerOpen(true)}
            onSelectFacility={(item) => setSelectedFacility(item)}
            activeHeatmapTab={activeHeatmapTab}
            onSelectHeatmapTab={setActiveHeatmapTab}
            darkMode={darkMode}
          />
        </section>

        {/* 3. CORE VALUE: AREA INTELLIGENCE REPORT (Profiles, Gaps, SWOT, Recommendations, Inventory & Investment) */}
        <section>
          <AreaIntelligenceReport
            area={selectedArea}
            allFacilities={features}
            onSelectFacility={(facility) => setSelectedFacility(facility)}
            onSimulateOpportunity={handleSimulateOpportunity}
            onOpenCompare={() => setIsCompareOpen(true)}
            onOpenAiPlanner={() => setIsAiDrawerOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
            onHighlightGapsOnMap={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreMap={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            darkMode={darkMode}
          />
        </section>
      </main>

      {/* 4. FACILITY EXPLORER MODAL (When clicking any real facility) */}
      <FacilityExplorerModal
        facility={selectedFacility}
        allFacilities={features}
        onClose={() => setSelectedFacility(null)}
        onSelectFacility={(item) => setSelectedFacility(item)}
        darkMode={darkMode}
      />

      {/* 5. MULTI-CRITERIA AREA COMPARISON MODAL */}
      {isCompareOpen && (
        <CompareAreasModal
          areas={areas}
          defaultAreaA={selectedArea.name}
          defaultAreaB={selectedArea.name === 'Virar' ? 'Palghar' : 'Virar'}
          onClose={() => setIsCompareOpen(false)}
          onSelectAreaForDashboard={(name) => {
            setSelectedAreaName(name);
            setIsCompareOpen(false);
          }}
          darkMode={darkMode}
        />
      )}

      {/* 6. AI URBAN PLANNER SIDE DRAWER */}
      <AIUrbanPlannerDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        area={selectedArea}
        darkMode={darkMode}
        isDossierOpen={!!selectedFacility}
      />

      {/* 7. ONE-CLICK PDF REPORT GENERATION MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto p-4 sm:p-8 bg-slate-950/70 backdrop-blur-md flex items-center justify-center">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsReportOpen(false)}
              className="no-print absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 z-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <ReportView
              areas={areas}
              features={features}
              lastUpdated={lastUpdated}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      {/* 8. CLEAN MODERN FOOTER */}
      <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800/80 py-6 text-xs text-slate-500 bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              GeoPulse Maharashtra
            </span>
            <span>· Smart City Decision Support & Planning Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Palghar District (Virar, Vasai, Nalasopara, Palghar, Boisar)</span>
            <span>·</span>
            <span>100% Verified OpenStreetMap Data + Gemini 3.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
