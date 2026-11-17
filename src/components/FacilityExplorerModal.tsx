import React from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  Building2,
  Activity,
  GraduationCap,
  Train,
  Shield,
  Flame,
  TreePine,
  Landmark,
  CheckCircle2,
  Layers,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { InfrastructureItem } from '../types';
import { getPlaceIntelligence } from '../services/facilityIntelligence';

interface FacilityExplorerModalProps {
  facility: InfrastructureItem | null;
  allFacilities: InfrastructureItem[];
  onClose: () => void;
  onSelectFacility: (item: InfrastructureItem) => void;
  darkMode: boolean;
}

export const FacilityExplorerModal: React.FC<FacilityExplorerModalProps> = ({
  facility,
  allFacilities,
  onClose,
  onSelectFacility,
  darkMode,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!facility) return null;

  const info = getPlaceIntelligence(facility, allFacilities);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(info.coordinates);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'hospital':
      case 'clinic':
        return <Activity className="w-5 h-5 text-rose-500" />;
      case 'school':
      case 'college':
      case 'university':
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'railway':
        return <Train className="w-5 h-5 text-amber-500" />;
      case 'bus':
        return <Navigation className="w-5 h-5 text-cyan-500" />;
      case 'police':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'park':
        return <TreePine className="w-5 h-5 text-emerald-500" />;
      case 'bank':
        return <Landmark className="w-5 h-5 text-indigo-500" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-400" />;
    }
  };

  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${facility.lat}&mlon=${facility.lng}#map=17/${facility.lat}/${facility.lng}`;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-5 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-4 border-b pb-4 border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 shadow-md border border-slate-700">
              {getCategoryIcon(facility.category)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-[#E2E8F0] border border-slate-700">
                  {info.category}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {info.area}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {info.scoreContribution}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                {info.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spatial Coordinates & Center Distance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[12px] font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Area & Distance</span>
            </div>
            <div className="text-sm font-bold text-white">
              {info.area}, Palghar District
            </div>
            <p className="text-xs text-sky-400 font-semibold font-mono">
              Distance from Center: {info.distanceFromCenter}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[12px] font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>GIS Coordinates</span>
              </span>
              <button
                onClick={handleCopyCoords}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">
              {info.coordinates}
            </div>
            <p className="text-[11px] text-slate-300">WGS84 EPSG:4326 Node</p>
          </div>
        </div>

        {/* Full Address */}
        <div className="p-3.5 rounded-2xl border border-slate-700/80 bg-slate-800/60 space-y-1">
          <div className="text-[12px] font-semibold text-slate-300">
            Full Address
          </div>
          <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed font-medium">
            {info.address}
          </p>
        </div>

        {/* Description & Operational Status */}
        <div className="p-3.5 rounded-2xl border border-slate-700/80 bg-slate-800/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-300">
              Facility Description & Status
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              {info.operationalStatus}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
            {info.description}
          </p>
        </div>

        {/* Service Coverage Radius */}
        <div className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Service Coverage Radius</span>
          </div>
          <p className="text-xs text-[#F8FAFC] leading-relaxed">
            {info.coverageRadius}
          </p>
        </div>

        {/* Development Impact & Accessibility Contribution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
            <div className="text-[12px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Accessibility Contribution</span>
            </div>
            <div className="text-base font-black font-mono text-emerald-300">
              {info.scoreContribution}
            </div>
            <p className="text-[11px] text-[#F8FAFC]">
              {info.accessibilityImpact}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-700/80 bg-slate-800/60 space-y-1">
            <div className="text-[12px] font-semibold text-slate-300">
              Development Impact
            </div>
            <p className="text-xs text-[#F8FAFC] leading-relaxed">
              {info.developmentImpact}
            </p>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="p-4 rounded-2xl border border-purple-500/40 bg-purple-950/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Urban Planner Recommendation</span>
          </div>
          <p className="text-xs sm:text-sm text-[#F8FAFC] font-medium leading-relaxed">
            {info.aiRecommendation}
          </p>
        </div>

        {/* Nearby Facilities */}
        {info.nearbyFacilities.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300">
              Nearby Facilities
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {info.nearbyFacilities.map((n) => {
                const matchObj = allFacilities.find((f) => f.id === n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (matchObj) onSelectFacility(matchObj);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/60 bg-slate-800/50 cursor-pointer transition text-xs"
                  >
                    <div className="font-bold text-white truncate">{n.name}</div>
                    <div className="text-[10px] text-slate-400">{n.category}</div>
                    <div className="font-mono text-[11px] font-bold text-emerald-400 mt-1">
                      {n.distance}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* External Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800 text-white font-bold text-xs transition"
          >
            <span>OpenStreetMap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
