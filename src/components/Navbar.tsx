import React from 'react';
import {
  Compass,
  Map,
  BarChart3,
  Flame,
  FileText,
  Bot,
  Sun,
  Moon,
  Home,
  MapPin,
} from 'lucide-react';
import { PALGHAR_AREAS } from '../data/palgharData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedArea,
  setSelectedArea,
  darkMode,
  setDarkMode,
  onOpenChat,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Interactive Map', icon: Map },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'heatmap', label: 'Heatmap', icon: Flame },
    { id: 'report', label: 'PDF Report', icon: FileText },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors backdrop-blur-md border-b ${
        darkMode
          ? 'bg-slate-950/85 border-slate-800 text-slate-100'
          : 'bg-white/85 border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight font-sans">
                GeoPulse
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                Palghar
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Smart City Infrastructure Analyzer
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  active
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Area Selector Dropdown */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                if (activeTab === 'home') setActiveTab('map');
              }}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className={darkMode ? 'bg-slate-900' : 'bg-white'}>
                All Areas (Overview)
              </option>
              {PALGHAR_AREAS.map((a) => (
                <option key={a.id} value={a.name} className={darkMode ? 'bg-slate-900' : 'bg-white'}>
                  {a.name} ({a.accessibilityScore}/100)
                </option>
              ))}
            </select>
          </div>

          {/* AI Chat Button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Toggle Dark/Light Mode"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 text-[11px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-medium transition ${
                active ? 'text-emerald-500 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
