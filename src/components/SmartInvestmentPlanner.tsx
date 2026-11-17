import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  Activity,
  GraduationCap,
  Train,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { AreaInfo } from '../types';

interface SmartInvestmentPlannerProps {
  area: AreaInfo;
  onApplyInvestmentSimulation?: (sector: string, name: string) => void;
  darkMode: boolean;
}

export const SmartInvestmentPlanner: React.FC<SmartInvestmentPlannerProps> = ({
  area,
  onApplyInvestmentSimulation,
  darkMode,
}) => {
  const [budgetCr, setBudgetCr] = useState<number>(100);

  // Dynamic budget allocation based on the area's deficit priorities
  const calculateAllocations = (budget: number) => {
    let healthPct = 0.35;
    let eduPct = 0.25;
    let transitPct = 0.25;
    let civicPct = 0.15;

    if (area.name === 'Nalasopara') {
      // Acute hospital deficit
      healthPct = 0.50;
      transitPct = 0.25;
      eduPct = 0.15;
      civicPct = 0.10;
    } else if (area.name === 'Boisar') {
      // Burn center & Freight bypass
      healthPct = 0.40;
      transitPct = 0.35;
      civicPct = 0.15;
      eduPct = 0.10;
    } else if (area.name === 'Palghar') {
      // Medical College & Regional transit
      healthPct = 0.45;
      transitPct = 0.25;
      eduPct = 0.20;
      civicPct = 0.10;
    } else if (area.name === 'Virar') {
      // East hospital & Transit terminal
      healthPct = 0.40;
      transitPct = 0.30;
      eduPct = 0.18;
      civicPct = 0.12;
    }

    const healthAmt = Math.round(budget * healthPct);
    const eduAmt = Math.round(budget * eduPct);
    const transitAmt = Math.round(budget * transitPct);
    const civicAmt = Math.max(1, budget - healthAmt - eduAmt - transitAmt);

    // Expected score delta (diminishing returns formula)
    const expectedImprovement = Math.min(
      24,
      Math.round(Math.sqrt(budget) * 1.6 + (budget >= 100 ? 3 : 1))
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

  const plan = calculateAllocations(budgetCr);

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg space-y-6">
      {/* Header */}
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
                AI Budget Optimizer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate municipal capital expenditure allocation for <strong>{area.name}</strong> based on GIS deficit priorities.
            </p>
          </div>
        </div>

        {/* Expected Score Delta Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
          <TrendingUp className="w-4 h-4" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Projected Score Improvement
            </div>
            <div className="text-sm font-extrabold font-mono">
              {area.accessibilityScore} → {plan.projectedScore} pts{' '}
              <span className="text-emerald-500 font-bold">(+{plan.expectedImprovement})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Enter Municipal Capital Budget:
          </label>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            ₹{budgetCr} Crore
          </span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="10"
          max="500"
          step="5"
          value={budgetCr}
          onChange={(e) => setBudgetCr(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[25, 50, 100, 150, 250, 500].map((preset) => (
            <button
              key={preset}
              onClick={() => setBudgetCr(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                budgetCr === preset
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              ₹{preset} Cr
            </button>
          ))}
        </div>
      </div>

      {/* Sector Allocation Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Healthcare */}
        <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-50/30 dark:bg-rose-950/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Healthcare
            </span>
            <span>{plan.health.pct}%</span>
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{plan.health.amt} Cr
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Funds {area.name === 'Nalasopara' ? '200-Bed Tertiary Hospital' : area.name === 'Boisar' ? 'Burn Trauma Center' : 'Secondary Municipal PHCs'}
          </p>
        </div>

        {/* Transport */}
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span className="flex items-center gap-1.5">
              <Train className="w-4 h-4" /> Transportation
            </span>
            <span>{plan.transit.pct}%</span>
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{plan.transit.amt} Cr
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Funds {area.name === 'Vasai' ? 'Elevated Bypass Flyover' : 'Skywalk & Electric Feeder Depot'}
          </p>
        </div>

        {/* Education */}
        <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-50/30 dark:bg-purple-950/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Education
            </span>
            <span>{plan.edu.pct}%</span>
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{plan.edu.amt} Cr
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Smart laboratories, secondary schools & STEM wings
          </p>
        </div>

        {/* Civic & Green */}
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Civic & Parks
            </span>
            <span>{plan.civic.pct}%</span>
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
            ₹{plan.civic.amt} Cr
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Flood detention reservoirs & public recreational reserves
          </p>
        </div>
      </div>

      {/* Concrete Outcomes Funded */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2.5">
        <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Municipal Infrastructure Milestones Unlocked by ₹{budgetCr} Cr</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              +{Math.round(plan.health.amt * 1.5)} Certified Inpatient Beds
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              +{Math.round(plan.transit.amt * 450)} Daily Commuter Feeder Capacity
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              +{Math.round(plan.edu.amt * 28)} Modernized Classrooms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
